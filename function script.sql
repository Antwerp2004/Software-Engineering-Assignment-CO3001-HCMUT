-- Hàm hasEnoughPaper() kiểm tra có đủ số trang không
DROP FUNCTION IF EXISTS hasEnoughPaper;
delimiter ;;
create function hasEnoughPaper(
	userID VARCHAR(45),
    pageType VARCHAR(45),
    pageNum INT
)
returns int
deterministic
begin
	declare pageRem int;
    declare scale decimal(3,1);
    
    -- Fetch the page's price sacle compare to A4
    SELECT `Giá tiền (VND)` / 1000 INTO scale
    FROM user_pagecharacteristic
    WHERE `Loại trang` = pageType COLLATE utf8mb4_unicode_ci;
    
    select `Số dư trang` into pageRem
    from user_profile
    where ID=userID COLLATE utf8mb4_unicode_ci;
    
    if ceil(pageNum*scale) <= pageRem then
		return 1;
	else return 0;
    end if;
end;;
delimiter ;

select hasEnoughPaper('USER00001','B5',343) as result, value from true_false;

DROP PROCEDURE IF EXISTS logPrint;
-- Procedure để thêm log vào bảng admin_printhistory
DELIMITER //
CREATE PROCEDURE logPrint(
    IN userID VARCHAR(45),
    IN printerID VARCHAR(45),
    IN documentName VARCHAR(45),
    IN pageType VARCHAR(45),
    IN pageBoughtNum INT
)
BEGIN
	DECLARE logID VARCHAR(45);
	DECLARE customerName VARCHAR(45);
    DECLARE printerName VARCHAR(45);
    DECLARE startTime DATETIME;
    DECLARE endTime DATETIME;
    DECLARE pageTypeCost INT;
    DECLARE availablePageNum INT;

	SELECT `Tên máy in` INTO printerName
    FROM admin_printers
    WHERE `Mã máy in` = printerID COLLATE utf8mb4_unicode_ci;
    
    SELECT `Tên người dùng` INTO customerName
    FROM user_profile
    WHERE `ID` = userID COLLATE utf8mb4_unicode_ci;

    -- Fetch the price and available pages for the specified page type
    SELECT `Giá tiền (VND)` INTO pageTypeCost
    FROM user_pagecharacteristic
    WHERE `Loại trang` = pageType COLLATE utf8mb4_unicode_ci;

    -- Set start and end times
    SET startTime = NOW(); -- Current datetime
    SET endTime = DATE_ADD(startTime, INTERVAL 2 MINUTE); -- Add 2 minutes for the end time
    
    -- Set printID
    SET logID = CONCAT('PRINT', LPAD((SELECT COUNT(*) FROM admin_printhistory) + 3301, 5, '0'));

    -- Insert the print action into Admin_PrintHistory
    INSERT INTO admin_printhistory (
		`Mã in`,
        `Mã người dùng`,
        `Tên người dùng`,
        `Mã máy in`,
        `Tên máy in`,
        `Tên tài liệu`,
        `Thời gian bắt đầu`,
        `Thời gian kết thúc`,
        `Loại trang`,
        `Giá tiền loại trang (VND)`,
        `Số lượng trang mua`,
        `Giá tiền tổng (VND)`,
        `Trạng thái`
    )
    VALUES (
		logID,
        userID,
        customerName,
        printerID,
        printerName,
        documentName,
        startTime,
        endTime,
        pageType,
        pageTypeCost,
        pageBoughtNum,
        pageBoughtNum*(pageTypeCost), -- Add a fixed cost for the total price
        'Hoàn tất' -- Default status
    );
END //
DELIMITER ;

call logPrint('USER00006','PRN047','Bố già - Mario Puzo.pdf','A4',700);

DROP PROCEDURE IF EXISTS updateRemainingPaper;
-- Hàm updateRemainingPaper cập nhật số trang còn lại sau khi in
DELIMITER //
CREATE PROCEDURE updateRemainingPaper(
    IN userID VARCHAR(45),
    IN pageType VARCHAR(45),
    IN numPages INT
)
BEGIN
    DECLARE remainingPages INT;
    DECLARE scale DECIMAL(10,1);

    -- Fetch the current number of remaining pages for the user and page type
    SELECT `Số dư trang` INTO remainingPages
    FROM user_profile
    WHERE `ID` = userID COLLATE utf8mb4_unicode_ci;
    
    -- Fetch the page's price sacle compare to A4
    SELECT `Giá tiền (VND)` / 1000 INTO scale
    FROM user_pagecharacteristic
    WHERE `Loại trang` = pageType COLLATE utf8mb4_unicode_ci;

    -- Check if the user has enough pages
    IF remainingPages >= numPages THEN
        -- Update the remaining page count
        UPDATE user_profile
        SET `Số dư trang` = `Số dư trang` - ceil(numPages * scale)
        WHERE `ID` = userID COLLATE utf8mb4_unicode_ci;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Not enough pages remaining.';
    END IF;
END //
DELIMITER ;

call updateRemainingPaper('USER00002','Legal',2);

DROP PROCEDURE IF EXISTS updateBuyLog;
DELIMITER //
CREATE PROCEDURE updateBuyLog(
    IN userID VARCHAR(45),
    IN pageType VARCHAR(45),
    IN quan INT,
    IN total VARCHAR(45),
    IN buyTime DATETIME,
    IN status VARCHAR(255)
)
BEGIN
	DECLARE orderID VARCHAR(255);
	SET orderID = CONCAT('ORD', LPAD((SELECT COUNT(*) FROM user_pageorder) + 1, 5, '0'));
    INSERT INTO user_pageorder ("Mã đơn hàng", "Mã khách hàng", "Loại trang", "Số lượng trang mua", "Số tiền (VND)", "Ngày thanh toán", "Trạng thái")
    VALUES (orderID, userID, pageType, quan, total, buyTime, 'Đã thanh toán');
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS GetPrintSummary;
DELIMITER $$
CREATE PROCEDURE GetPrintSummary()
BEGIN
    -- Select the summarized data grouped by year and month
    SELECT 
        YEAR("Thời gian bắt đầu") AS `year`,
        MONTH("Thời gian bắt đầu") AS `month`,
        SUM(CASE WHEN "Loại trang" = 'A4' THEN "Số lượng trang mua" ELSE 0 END) AS a4,
        SUM(CASE WHEN "Loại trang" = 'A3' THEN "Số lượng trang mua" ELSE 0 END) AS a3,
        SUM(CASE WHEN "Loại trang" = 'B4' THEN "Số lượng trang mua" ELSE 0 END) AS b4,
        SUM(CASE WHEN "Loại trang" = 'B5' THEN "Số lượng trang mua" ELSE 0 END) AS b5,
        SUM(CASE WHEN "Loại trang" = 'C5' THEN "Số lượng trang mua" ELSE 0 END) AS c5,
        SUM(CASE WHEN "Loại trang" = 'DL' THEN "Số lượng trang mua" ELSE 0 END) AS dl,
        SUM(CASE WHEN "Loại trang" = 'Letter' THEN "Số lượng trang mua" ELSE 0 END) AS letter,
        SUM(CASE WHEN "Loại trang" = 'Legal' THEN "Số lượng trang mua" ELSE 0 END) AS legal,
        COUNT(DISTINCT "Mã máy in") AS printers,
        SUM("Giá tiền tổng (VND)") AS revenue
    FROM 
        admin_printhistory
    GROUP BY 
        YEAR("Thời gian bắt đầu"), 
        MONTH("Thời gian bắt đầu")
    ORDER BY 
        `year` ASC, 
        `month` ASC;
END$$

DELIMITER ;
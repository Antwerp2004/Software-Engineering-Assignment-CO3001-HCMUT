const {database} = require("../index.js")

const {pagination_item_per_page} = require("../configs/system.js");

const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
    host: process.env.database_host,
    port: process.env.database_port,
    user: process.env.database_user,
    password: process.env.database_password,
    database: process.env.database_name
});

module.exports.checkUserEmail = (userID) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            const isExisting = results[0]['count(*)'];
            if (err) reject(err);
            else {
                if (isExisting) resolve(true)
                else resolve(false)
            }
        }
        connection.query(
            `SELECT count(*)
            FROM user_profile
            WHERE Email = '${userID}'`,
            func
        )
    })
}

module.exports.getUserID = (userEmail) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results[0]['ID']);
        }
        connection.query(
            `SELECT ID
            FROM user_profile
            WHERE Email = '${userEmail}'`,
            func
        )
    })
}


module.exports.checkAdminEmail = (userEmail) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            const isExisting = results[0]['count(*)'];
            if (err) reject(err);
            else {
                if (isExisting) resolve(true)
                else resolve(false)
            }
        }
        connection.query(
            `SELECT count(*)
            FROM admin_profile
            WHERE Email = '${userEmail}'`,
            func
        )
    })
}

module.exports.getAdminID = (userEmail) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results[0]['ID']);
        }
        connection.query(
            `SELECT ID
            FROM admin_profile
            WHERE Email = '${userEmail}'`,
            func
        )
    })
}

module.exports.getPrinterID = (printerLocation) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results);
        }
        connection.query(
            `SELECT "mã máy in" FROM admin_printers
            WHERE "Địa điểm đặt máy" = '${printerLocation}'; `,
            func
        )
    })
}

module.exports.getPrinterLocation = () => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results);
        }
        connection.query(
            `SELECT "mã máy in", "Địa điểm đặt máy" FROM admin_printers
            WHERE "Trạng thái" = 'Đang hoạt động'; `,
            func
        )
    })
}

module.exports.getAllPrinterLocation = () => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results);
        }
        connection.query(
            `SELECT "mã máy in", "Địa điểm đặt máy" FROM admin_printers; `,
            func
        )
    })
}

module.exports.getPermittedType = () => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results[0]);
        }
        connection.query(
            `SELECT pdf, docx, pptx, png, jpg FROM CONFIG; `,
            func
        )
    })
}

module.exports.getRemainingPaper = (userID) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                resolve(results[0]['Số dư trang']);
            }
        }
        connection.query(
            `SELECT "Số dư trang" FROM user_profile
            WHERE ID = '${userID}'; `,
            func
        )
    })
}

module.exports.hasEnoughPaper = (userID, pageType, pageNum) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                resolve(results[0]['res']);
            }
        }
        connection.query(
            `SELECT hasEnoughPaper('${userID}', '${pageType}', '${pageNum}') AS res`,
            func
        )
    })
}

module.exports.updateRemainingPaper = (userID, pageType, numPages) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                resolve();
            }
        }
        connection.query(
            `call updateRemainingPaper('${userID}','${pageType}',${numPages});`,
            func
        )
    })
}

module.exports.updatePrintHistory = (userID, printerID, documentName, pageType, numPages) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                resolve();
            }
        }
        connection.query(
            `call logPrint('${userID}','${printerID}','${documentName}','${pageType}',${numPages});`,
            // `call logPrint('USER00002','PRN039','Bố già - Mario Puzo.pdf','A4',700);`,
            func
        )
    })
}

module.exports.filterLog = (startDate, endDate, printerID, userID) => {
    let startDateCond, endDateCond, printerIDCond;

    if (startDate) startDateCond = `"Thời gian bắt đầu" >= '${startDate}'`
    else startDateCond = 'true'
    if (endDate) endDateCond = `"Thời gian bắt đầu" <= '${endDate}'`
    else endDateCond = 'true'
    if (printerID) printerIDCond = `"Mã máy in" = '${printerID}'`
    else printerIDCond = 'true'

    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                // Format the date for each row
                const formattedResults = results.map((row) => {
                    const startDateObj = new Date(row["Thời gian bắt đầu"]);
                    const formattedStartDate = `${String(startDateObj.getDate()).padStart(2, '0')}/${String(startDateObj.getMonth() + 1).padStart(2, '0')}/${startDateObj.getFullYear()} ${String(startDateObj.getHours()).padStart(2, '0')}:${String(startDateObj.getMinutes()).padStart(2, '0')}:${String(startDateObj.getSeconds()).padStart(2, '0')}`;

                    const endDateObj = new Date(row["Thời gian kết thúc"]);
                    const formattedEndDate = `${String(endDateObj.getDate()).padStart(2, '0')}/${String(endDateObj.getMonth() + 1).padStart(2, '0')}/${endDateObj.getFullYear()} ${String(endDateObj.getHours()).padStart(2, '0')}:${String(endDateObj.getMinutes()).padStart(2, '0')}:${String(endDateObj.getSeconds()).padStart(2, '0')}`;
                    
                    return {
                        ...row,
                        "Thời gian bắt đầu": formattedStartDate,
                        "Thời gian kết thúc": formattedEndDate
                    };
                });
                resolve(formattedResults);
            }
        }
        connection.query(
            `SELECT "Mã máy in", "Tên tài liệu", "Thời gian bắt đầu", "Thời gian kết thúc", "Loại trang", "Số lượng trang mua"
            FROM admin_printhistory
            WHERE 
                "Mã người dùng" = '${userID}' AND
                ${startDateCond} AND ${endDateCond} AND ${printerIDCond}
            ORDER BY "Thời gian bắt đầu" desc
            ;`,
            func
        )
    })
}

module.exports.logPayment = (userID) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                // Format the date for each row
                const formattedResults = results.map((row) => {
                    const dateObj = new Date(row["Ngày thanh toán"]);
                    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
                    
                    return {
                        ...row,
                        "Ngày thanh toán": formattedDate,
                    };
                });
                resolve(formattedResults);
            }
        }
        connection.query(
            `SELECT "Mã đơn hàng", "Số lượng trang mua", "Số tiền (VND)", "Ngày thanh toán", "Trạng thái"
            FROM user_pageorder
            WHERE "Mã khách hàng" = '${userID}'
            ORDER BY "Ngày thanh toán" desc
            ; `,
            func
        )
    })
}

module.exports.getUserProfile = (userID) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                resolve(results[0]);
            }
        }
        connection.query(
            `SELECT * FROM user_profile WHERE ID = '${userID}';`,
            func
        )
    })
}

module.exports.updateRemainingPaperBuyPaper = (userID, pageType, quantity) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                resolve();
            }
        }
        connection.query(
            `UPDATE user_profile
            SET "Số dư trang" = "Số dư trang" + ${quantity}
            WHERE ID = '${userID}'`,
            func
        )
    })
}

module.exports.updateBuyLog = (userID, pageType, quantity, total, status) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                resolve();
            }
        }
        connection.query(
            `call updateBuyLog('${userID}', '${pageType}', ${quantity}, ${total}, now(), '${status}')`,
            func
        )
    })
}

module.exports.getTotalLogAdmin = (startDate, endDate, printerID, studentID) => {
    let startDateCond, endDateCond, printerIDCond, studentIDCond;

    if (startDate) startDateCond = `"Thời gian bắt đầu" >= '${startDate}'`
    else startDateCond = 'true'
    if (endDate) endDateCond = `"Thời gian bắt đầu" <= '${endDate}'`
    else endDateCond = 'true'
    if (printerID) printerIDCond = `"Mã máy in" = '${printerID}'`
    else printerIDCond = 'true'
    if (studentID) studentIDCond = `"Mã người dùng" = '${studentID}'`
    else studentIDCond = 'true'

    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                const totalLog = Math.ceil(results[0]['count(*)'] / pagination_item_per_page)
                resolve(totalLog)
            }
        }
        connection.query(
            `SELECT count(*)
            FROM admin_printhistory
            WHERE ${startDateCond} AND ${endDateCond} AND ${printerIDCond} AND ${studentIDCond};`,
            func
        )
    })
}

module.exports.getLogAdmin = (page, startDate, endDate, printerID, studentID) => {
    let startDateCond, endDateCond, printerIDCond, studentIDCond;

    if (startDate) startDateCond = `"Thời gian bắt đầu" >= '${startDate}'`
    else startDateCond = 'true'
    if (endDate) endDateCond = `"Thời gian bắt đầu" <= '${endDate}'`
    else endDateCond = 'true'
    if (printerID) printerIDCond = `"Mã máy in" = '${printerID}'`
    else printerIDCond = 'true'
    if (studentID) studentIDCond = `"Mã người dùng" = '${studentID}'`
    else studentIDCond = 'true'

    const offset = (page - 1) * pagination_item_per_page;
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else {
                // Format the date for each row
                const formattedResults = results.map((row) => {
                    const startDateObj = new Date(row["Thời gian bắt đầu"]);
                    const formattedStartDate = `${String(startDateObj.getDate()).padStart(2, '0')}/${String(startDateObj.getMonth() + 1).padStart(2, '0')}/${startDateObj.getFullYear()} ${String(startDateObj.getHours()).padStart(2, '0')}:${String(startDateObj.getMinutes()).padStart(2, '0')}:${String(startDateObj.getSeconds()).padStart(2, '0')}`;

                    const endDateObj = new Date(row["Thời gian kết thúc"]);
                    const formattedEndDate = `${String(endDateObj.getDate()).padStart(2, '0')}/${String(endDateObj.getMonth() + 1).padStart(2, '0')}/${endDateObj.getFullYear()} ${String(endDateObj.getHours()).padStart(2, '0')}:${String(endDateObj.getMinutes()).padStart(2, '0')}:${String(endDateObj.getSeconds()).padStart(2, '0')}`;
                    
                    return {
                        ...row,
                        "Thời gian bắt đầu": formattedStartDate,
                        "Thời gian kết thúc": formattedEndDate
                    };
                });
                resolve(formattedResults)
            }
        }
        connection.query(
            `SELECT "Mã người dùng", "Mã máy in", "Tên tài liệu", "Thời gian bắt đầu", "Thời gian kết thúc", "Loại trang", "Số lượng trang mua"
            FROM admin_printhistory
            WHERE ${startDateCond} AND ${endDateCond} AND ${printerIDCond} AND ${studentIDCond}
            ORDER BY "Thời gian bắt đầu" desc
            LIMIT ${pagination_item_per_page} OFFSET ${offset};`,
            func
        )
    })
}

module.exports.getPrinterAdmin = () => {
    const listLocation = new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results);
        }
        connection.query(
            `SELECT DISTINCT  "Địa điểm đặt máy"
            FROM admin_printers
            ORDER BY "Địa điểm đặt máy";`,
            func
        )
    })

    // return listLocation.then(async (results) => {
    //     await results.forEach((location) => {
    //         function func(err, results, fields) {
    //             location.printer = results;
    //         }
    //         connection.query(
    //             `SELECT "Mã máy in", "Tên máy in", "Hãng máy in", "Thông tin mô tả", "Địa điểm đặt máy", "Trạng thái"
    //             FROM admin_printers
    //             WHERE "Địa điểm đặt máy" = ${location["Địa điểm đặt máy"]}
    //             ORDER BY "Mã máy in"
    //             ;`,
    //             func             
    //         )
    //     })
    //     return results;
    // })

    return listLocation.then((results) => {
        return Promise.all(
            results.map(location => {
                return new Promise((resolve, reject) => {
                    connection.query(
                        `SELECT "Mã máy in", "Tên máy in", "Hãng máy in", "Thông tin mô tả", "Địa điểm đặt máy", "Trạng thái"
                         FROM admin_printers
                         WHERE "Địa điểm đặt máy" = ?
                         ORDER BY "Mã máy in";`,
                        [location["Địa điểm đặt máy"]],
                        (err, results) => {
                            if (err) reject(err);
                            else {
                                location.printer = results; // Attach printers to the location
                                resolve(location); // Resolve with the enriched location
                            }
                        }
                    );
                });
            })
        );
    
        return detailedLocations;
    })
}

module.exports.modifyStatusPrinter = (id, status) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve()
        }
        connection.query(
            `UPDATE admin_printers
            SET "Trạng thái" = '${status}'
            WHERE "Mã máy in" = '${id}'`,
            func
        )
    })
}

module.exports.getAdminProfile = (userID) => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results[0])
        }
        connection.query(
            `SELECT * FROM admin_profile
            WHERE ID = '${userID}'`,
            func
        )
    })
}

module.exports.getDataReportAdmin = () => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results[0])
        }
        connection.query(
            `call GetPrintSummary();`,
            func
        )
    })
}

module.exports.test = () => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results)
        }
        connection.query(
            `call test()`,
            func
        )
    })
}

module.exports.getConfig = () => {
    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve(results[0])
        }
        connection.query(
            `SELECT * FROM CONFIG`,
            func
        )
    })
}

module.exports.updateConfig = (providingDate, paperPerMonth, pdf, docx, pptx, png, jpg) => {
    let pdfCond, docCond, pptxCond, pngCond, jpgCond;

    if (pdf) pdfCond = 1;
    else pdfCond = 0;
    if (docx) docCond = 1;
    else docCond = 0;
    if (pptx) pptxCond = 1;
    else pptxCond = 0;
    if (png) pngCond = 1;
    else pngCond = 0;
    if (jpg) jpgCond = 1;
    else jpgCond = 0;

    return new Promise((resolve, reject) => {
        function func(err, results, fields) {
            if (err) reject(err);
            else resolve()
        }
        connection.query(
            `UPDATE CONFIG
            SET providingDate = ${providingDate}, paperPerMonth = ${paperPerMonth},
                pdf = ${pdfCond}, docx = ${docCond}, pptx = ${pptxCond},
                png = ${pngCond}, jpg = ${jpgCond}
            WHERE providingDate > 0`,
            func
        )
    })
}
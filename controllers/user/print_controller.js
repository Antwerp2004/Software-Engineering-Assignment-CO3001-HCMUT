const userModel = require("../../models/user_model.js")

const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');
const JSZip = require('jszip');
const xml2js = require('xml2js');

// [GET] /print
module.exports.home = async (req, res) => {
    const userID = req.user;

    const printerLocation = await userModel.getPrinterLocation();
    const permittedType = await userModel.getPermittedType();

    // Convert the permittedType object to a string of permitted file extensions
    const permittedExtensions = Object.entries(permittedType)
    .filter(([key, value]) => value === 1) // Filter only the permitted types
    .map(([key]) => `.${key}`) // Format the keys with a dot
    .join(', '); // Join them into a single string

    const remainingPaper = await userModel.getRemainingPaper(userID);
    res.render("./user/pages/print.pug", {
        remainingPaper: remainingPaper,
        printerLocation: printerLocation,
        permittedExtensions: permittedExtensions
    })
}

// [POST] /print
module.exports.print = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const filename = file.originalname;
    const filepath = file.path;
    let pageCount = 0;

    if (file.mimetype === 'application/pdf') {
        // Extract page count from PDF
        const pdfBytes = fs.readFileSync(filepath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        pageCount = pdfDoc.getPageCount();
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Approximate page count from Word document
        const docText = await mammoth.extractRawText({ path: filepath });
        pageCount = Math.ceil(docText.value.split('\n').length / 24); // Approximation
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        // Extract slide count from PowerPoint
        const zip = await JSZip.loadAsync(fs.readFileSync(filepath));
        const pptXml = await zip.file('ppt/presentation.xml').async('text');
        const parser = new xml2js.Parser();
        const xmlData = await parser.parseStringPromise(pptXml);

        pageCount = xmlData['p:presentation']['p:sldIdLst'][0]['p:sldId'].length; // Slide count
    } else if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        // Handle PNG and JPG images
        const dimensions = sizeOf(filepath);
        if (dimensions.width && dimensions.height) {
            pageCount = 1; // Each image is treated as a single page
        } else {
            return res.status(400).send('Invalid image file.');
        } 
    } else {
        return res.status(400).send('Unsupported file type.');
    }

    // Clean up uploaded file
    fs.unlinkSync(filepath);

    // res.json({ filename, pageCount });
    const userID = req.user;
    const printerID = req.body.printerID
    const paperSize = req.body.paper_size
    const pagesPerPaper = req.body.pages_per_paper
    const doubleSide = req.body.double_sided

    let pageNum;
    if (doubleSide) pageNum = Math.ceil(pageCount / (pagesPerPaper * 2))
    else pageNum = Math.ceil(pageCount / pagesPerPaper);

    pageNum = parseInt(pageNum);

    const hasEnoughPaper = await userModel.hasEnoughPaper(userID, paperSize, pageNum);
    if (!hasEnoughPaper) {
        req.flash('error', 'Số dư giấy không đủ');
        res.redirect("/print");
        return;
    }

    await userModel.updatePrintHistory(userID, printerID, filename, paperSize, pageNum);
    await userModel.updateRemainingPaper(userID, paperSize, pageNum);

    req.flash('success', 'Gửi yêu cầu thành công');
    res.redirect("/print")
}
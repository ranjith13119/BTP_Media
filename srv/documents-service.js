const cds = require('@sap/cds');
const { Stream } = require("./handlers");

class Documents extends cds.ApplicationService {
    init() {
        this.on("sendMail", Stream.sendEmail);
        this.on("getDocument", Stream.DocumentExtract);
        this.on("getPDFFromHTML", Stream.exportPDFfromHTML);
        this.on("getPDFDocument", Stream.DocumentPDFExtract);
        this.on("getWordDoc", Stream.DocumnetWordExtract);
        this.on("sendPayload", Stream.checkOutlookRespose)
        return super.init();
    }
}

module.exports = {
    Documents
}
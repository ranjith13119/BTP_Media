const cds = require("@sap/cds");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const SapCFMailer = require("sap-cf-mailer");
const XlsxTemplate = require("xlsx-template");
const { Readable } = require("stream");
const pdf = require('html-pdf');
const htmlpdfnode = require('html-pdf-node');
const pdfDynamic = require('dynamic-html-pdf');
const { TemplateHandler } = require('easy-template-x');
const { createResolver } = require("easy-template-x-angular-expressions");

const sendEmail = async (req) => {
    const { to, Subject } = req.data;
    const mailer = new SapCFMailer.default("bpmworkflowruntime_mail");
    const mailTemplate = fs.readFileSync(path.join(__dirname, '../', 'templates/mail', 'emailTemp.html'), { encoding: 'utf-8' });
    var template = handlebars.compile(mailTemplate);
    // var replacements = {
    //     username: "Ranjithkumar Ayyavu",
    //     Content: "Test Email SAP CloudFoundry Email"
    // };

    // for adaptive card
    var replacements = {
        HeaderTitle: "Interview Schedule Invitation",
        Content: "Test Email SAP CloudFoundry Email",
        creator: {
            "name": "Ranjithkumar Ayyavu",
            "profileImage": "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg"
        },
        "createdUtc": "2017-02-14T06:08:39Z",
        description: "Interview request for the role of BTP Developer",
        "CandidateName": "XYZ",
        "CandidateID": "909090",
        "JobID": "565656",
        "Experience": "5"
    };
    var htmlToSend = template(replacements);
    let testMail = await mailer.sendMailTemplate({
        to: to,
        subject: Subject,
        html: htmlToSend,
        attachments: [{     // http://nodemailer.com/message/attachments/
            filename: 'Ranjith.pdf',
            path: 'srv/templates/PDF/Ranjith.pdf'
        }, {
            filename: 'attach.html',
            content: htmlToSend
        }]
    });
    return true;

}

const checkOutlookRespose = async (req) => {
    const { to, Subject } = req.data;
    const mailer = new SapCFMailer.default("bpmworkflowruntime_mail");
    const mailTemplate = fs.readFileSync(path.join(__dirname, '../', 'templates/mail', 'emailTemp.html'), { encoding: 'utf-8' });
    var template = handlebars.compile(mailTemplate);

    // for adaptive card
    var replacements = {
        HeaderTitle: "Interview Schedule Invitation",
        Content: "Test Email SAP CloudFoundry Email",
        creator: {
            "name": "Ranjithkumar Ayyavu",
            "profileImage": "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg"
        },
        "createdUtc": "2017-02-14T06:08:39Z",
        description: "Interview request for the role of BTP Developer",
        "CandidateName": "XYZ",
        "CandidateID": "909090",
        "JobID": "565656",
        "Experience": "5"
    };
    var htmlToSend = template(replacements);
    let testMail = await mailer.sendMailTemplate({
        to: to,
        subject: Subject,
        html: htmlToSend,
        attachments: [{     // http://nodemailer.com/message/attachments/
            filename: 'Ranjith.pdf',
            path: 'srv/templates/PDF/Ranjith.pdf'
        }, {
            filename: 'attach.html',
            content: htmlToSend
        }]
    });
    return true;

}

const DocumentExtract = async (req) => {
    const mailTemplate = fs.readFileSync(path.join(__dirname, '../', 'templates/Excel', 'excelTemp.xlsx'));
    var template = new XlsxTemplate(mailTemplate);
    template.substitute(1, {
        "people": [{
            "name": "Ranjith",
            "age": "25"
        }, {
            "name": "Raja",
            "age": "22"
        }]
    });
    var data = template.generate({ type: 'base64' });
    req._.res.setHeader('Content-disposition', 'attachment; filename=test.xlsx');
    req._.res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return _formatResult(data, req);
}

const _formatResult = async (data, req) => {
    const decodedMedia = new Buffer.from(data, "base64");
    const readable = new Readable();
    readable.push(decodedMedia);
    readable.push(null);
    req._.res.end(decodedMedia, 'binary');
    return {
        value: readable
    }
};

const DocumentPDFExtract = async (req) => {
    const pdfTemplate = fs.readFileSync(path.join(__dirname, '../', 'templates/PDF', 'Ranjith.pdf'));
    req._.res.setHeader('Content-disposition', 'attachment; filename=Ranjith.pdf');
    req._.res.setHeader('Content-type', 'application/pdf');
    return _formatResult(pdfTemplate, req);
}

const DocumnetWordExtract = async (req) => {
    const wordTemplate = fs.readFileSync(path.join(__dirname, '../', 'templates/Word', 'RanjithFIORI.docx'));
    const handler = new TemplateHandler({
        scopeDataResolver: createResolver({
            filters: {
                upper: (input) => (input || "").toUpperCase(),
                lower: (input) => (input || "").toLowerCase()
            }
        })
    });
    const doc = await handler.process(wordTemplate, {
        urls: [{
            email: "ranjith13119@gmail.com",
            git: "github.com/ranjith13119",
            linkedIn: "linkedin.com/in/ranjith-kumar-a02a17123"
        },
        {
            email: "ranjith7207@gmail.com",
            git: "github.com/ranjith7207",
            linkedIn: {
                _type: 'link',
                text: 'LinkedIn',  // optional - if not specified the `target` property will be used
                target: 'https://github.com/alonrbar/easy-template-x'
            }
        }]
    });
    req._.res.setHeader('Content-disposition', 'attachment; filename=Ranjith.docx');
    req._.res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    return _formatResult(doc, req);
}


const exportPDFfromHTML = async (req) => {
    const htmlTemplate = fs.readFileSync(path.join(__dirname, '../', 'templates/mail', 'emailHTMLTemp.html'), { encoding: 'utf-8' });
    // var template = handlebars.compile(htmlTemplate);
    // var replacements = {
    //     username: "Ranjithkumar Ayyavu",
    //     Content: "Test Email SAP CloudFoundry Email"
    // };
    // var htmlToConvert = template(replacements);
    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm"
    };

    console.log(htmlTemplate);
    // Custom handlebar helper
    pdfDynamic.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    })
    var document = {
        type: 'buffer',     // 'file' or 'buffer'
        template: htmlTemplate,
        context: {
            users: [
                {
                    name: 'aaa',
                    age: 24,
                    dob: '1/1/1991'
                },
                {
                    name: 'bbb',
                    age: 25,
                    dob: '1/1/1995'
                },
                {
                    name: 'ccc',
                    age: 24,
                    dob: '1/1/1994'
                }
            ]
        }
    }
    for (i = 0; i < 1; i++) {
        await pdfDynamic.create(document, options)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.error(error)
            });

    }


    //const pdfTemp = await pdf.create(htmlToConvert, { format: 'Letter' });

    // let options = { format: 'A4' };
    // let file = [{ url: "https://example.com", name: 'example.pdf' }];

    // htmlpdfnode.generatePdfs(file, options).then(output => {
    //     console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
    // });
    // console.log(pdfTemp);
    // req._.res.setHeader('Content-disposition', 'attachment; filename=Ranjith.pdf');
    // req._.res.setHeader('Content-type', 'application/pdf');
    // return _formatResult(pdfTemp, req);

}



module.exports = {
    sendEmail,
    DocumentExtract,
    DocumentPDFExtract,
    exportPDFfromHTML,
    DocumnetWordExtract,
    checkOutlookRespose
}
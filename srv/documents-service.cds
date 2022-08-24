using {com.document.trail as doc} from '../db/document';

service Documents {
    entity Document as projection on doc.Document;
    function getDocument() returns LargeBinary;
    function getPDFDocument() returns LargeBinary;
    function getPDFFromHTML() returns LargeBinary;
    function getWordDoc() returns LargeBinary;
    action sendMail(to : String, Subject : String) returns Boolean;
}

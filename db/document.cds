namespace com.document.trail;

using {
    managed,
    cuid
} from '@sap/cds/common';

entity Document : cuid, managed {
    @Core.MediaType                   : mediaType
    @Core.ContentDisposition.Filename : filename
    content   : LargeBinary;
    @Core.IsMediaType                 : true
    mediaType : String;
    filename  : String;
}

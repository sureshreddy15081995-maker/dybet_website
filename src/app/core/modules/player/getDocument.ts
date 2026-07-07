export interface GetDocumetsResponse {
    success: boolean;
    documents: Document[];
}

export interface Document {
    descr: string;
    docId: string;
    docType: string;
    fileName: string;
    status: string;
    userName: string;
}

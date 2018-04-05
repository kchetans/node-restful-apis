import UserDocumentsDataManager from "../../../../data-manager/UserDocuments";

let documentAPIS = {

    async addDocument(object, options) {
        let {params, user} = options;
        let {document_type, document_no, document_files} = object;
        let data = await UserDocumentsDataManager.addDocument({document_type, document_no, document_files}, user);
        return {
            data,
            message: "Document added successfully"
        }
    },

    async removeDocuments(object, options){
        let {document_id} = options.params;
        let data = await UserDocumentsDataManager.deleteDocument(document_id);
        return {
            data,
            message: "Document deleted successfully"
        }
    },

    async updateDocument(object, options){
        let data = await UserDocumentsDataManager.updateDocument(object, options);
        return {
            data,
            message: "Document updated successfully"
        }
    }

};

export default documentAPIS;
let documentAPIS = {

    async getUserResume(object, options) {
        return {
            data: "https://s3.ap-south-1.amazonaws.com/workex.test1/59855abc-2aa8-46a6-9c33-1a451188a1d9.pdf",
            message: "Document added successfully"
        }
    }

};

export default documentAPIS;
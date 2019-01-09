/**
 * Author:      Carlos Krefft
 * Date:        2/2/2018
 */

import * as esriRequest from 'esri/request';

/** An interface that defines the inputs of the activity. */
export interface GPFileUploadInputs {
    // @displayName file
    // @description The File object you want to upload.
    // @required
    file?: File;

    // @displayName URL
    // @description The URL of the upload service (https://domain.com/arcgis/rest/services/<ServiceName>/GPServer/uploads/upload)
    // @required
    url?: string;
}

/** An interface that defines the outputs of the activity. */
export interface GPFileUploadOutputs {
    /** A result of the activity. */
    // @displayName result
    // @description The result of the gp service response.
    result: string;

    /** A result of the activity. */
    // @displayName itemID
    // @description The itemID of the file that was uploaded.
    itemID: string;    
}

// @displayName GPFileUpload
// @category Custom Activities
// @description Allows users to upload a file to a Geoprocessing Service upload endpoint.
export class GPFileUpload {
    // The unique identifier of the activity.
    // This value should not be changed once an activity has been published.
    static action = "uuid:9386f870-62d2-42a6-a7ea-41986905f3ea::GPFileUpload";

    // The identifier of the suite of activities that this activity belongs to.
    // This value should not be changed once an activity has been published.
    static suite = "uuid:9386f870-62d2-42a6-a7ea-41986905f3ea";

    private uploadFile(url:string, form:FormData): Promise<any> {

        return new Promise<any>((resolve, reject) => {
            var upload = esriRequest({
                url: url,
                form: form,
                content: { f: "pjson" },
                handleAs: "json",
                load: function (response) {
                    resolve(response);
                },
                error: function (response) {
                    reject(new Error(response));
                }
            });             
        });
    
    }
    private getUploadform(file:File): FormData {
        //create form.
        var eleForm = document.createElement('form');
        eleForm.setAttribute('id', 'uploadForm');
        eleForm.setAttribute('method', 'post');
        eleForm.setAttribute('enctype', 'multipart/form-data');
        eleForm.style.display = 'none';

        var formData = new FormData(eleForm);
        formData.append("file", file);
        return formData;
    }

    // Perform the execution logic of the activity.
    async execute(inputs: GPFileUploadInputs): Promise<GPFileUploadOutputs> {
        
        var response: GPFileUploadOutputs;

        try {
            var uploadResponse = await this.uploadFile(inputs.url, this.getUploadform(inputs.file));
            
            if(uploadResponse.success){
                response = {result: uploadResponse, itemID: uploadResponse.item["itemID"]};
            }else{
                response = {result: uploadResponse, itemID: ""};
            }

        } catch (error) {
            response = {result: error, itemID: ""}
        }

        return response;
    }
}
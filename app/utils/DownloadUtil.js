import ApiUtils from './ApiUtils'

// const API_BASE_URL = "https://raw.githubusercontent.com/friendsofagape/Autographa_Repo/master/Bibles/";
const API_BASE_URL = 'https://stagingapi.autographamt.com/newdb/bibles/usfm'
const META_DATA_FILE_NAME = "package.json";
const USFM_ZIP_FILE_NAME = "Archive.zip";

var DownloadUtil = {
    async getLanguages() {
        try {
            return await fetch(API_BASE_URL, {  
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            // .then(ApiUtils.checkStatus)
            .then((response) => response.json())
            .catch(e => {
                console.log("e... "+e)
            })
        } catch(error) {
            console.log("error ... "+error)
            return error;
        }
    },

    async getVersions() {
        try {
            return await fetch(API_BASE_URL, {  
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(ApiUtils.checkStatus)
            .then((response) => response.json())
            .catch(e => e)
        } catch(error) {
            return error;
        }
    },
    
    async getMetadata() {
        try {
            return await fetch(API_BASE_URL, {  
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(ApiUtils.checkStatus)
            .then((response) => response.json())
            .catch(e => e)
        } catch(error) {
            return error;
        }
    },
}

export default DownloadUtil;
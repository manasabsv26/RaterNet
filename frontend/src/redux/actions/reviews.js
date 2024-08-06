export const FETCH_REVIEWS = 'FETCH_REVIEWS';

const baseUrl = 'http://localhost:7000/'


export const fetchReviews = async (id,locality)=>{
        const response = await fetch(baseUrl + "review/locality/" + id,{
            method: 'GET',
            headers : {
                'content-type' : 'multipart-form/data'
            },
            body : {
                locality : locality
            }
        });
        const responseData = await response.json();
        if (responseData.error) {
        throw new Error(responseData.error.message);
        }else {
            return responseData;
        }
}
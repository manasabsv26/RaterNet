export const FETCH_REVIEWS = 'FETCH_REVIEWS';

const baseUrl = 'http://localhost:7000/'


export const fetchReviews = async (id, locality) => {
    const response = await fetch(`${baseUrl}review/locality/${id}?locality=${locality}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'  // ✅ Use application/json for GET requests
        }
    });

    const responseData = await response.json();

    if (responseData.error) {
        throw new Error(responseData.error.message);
    } else {
        return responseData;  // ✅ Return the fetched reviews
    }
};
//GET request for server api with option to provide search 
async function getData(search = "") {
    try {
        const json = await getDataAsync(`${BASE_URL}${search}`);
        if (json != null) {
            displayData(json);
        }
        else {
            displayData({ searchError: "no results" });
        }
    }
    catch (err) {
 
    }
}

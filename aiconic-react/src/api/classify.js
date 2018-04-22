export async function uploadImageAsync(file) {
    let apiUrl = 'http://danielmo.com:5000/classify';
    let formData = new FormData();
    formData.append('classify', file[0]);

    let options = {
        method: 'POST',
        body: formData,

    };

    let result = await fetch(apiUrl, options);
    return result.json();

}

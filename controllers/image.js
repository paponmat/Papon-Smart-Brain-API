const PAT = 'c5399a2074724d5e9e660023be3cd7d1';
const USER_ID = 'paponmat';  
const APP_ID = 'Smart-Brain';
const MODEL_ID = 'face-detection';

const handleImage = async (req, res, db) => {
    const { id } = req.body;
    try {
        const updated  = await db('users')
            .where('id', id)
            .increment('entries', 1)
            .returning('entries');

        if (updated.length) {
            res.json(updated[0].entries);
        } else {
            res.status(400).json('Unable to update entry count');
        }
    } catch (error) {
        res.status(500).json('Internal server error');
    }
}

const returnClarifaiRequestOptions = (imageUrl) => {
  
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    return requestOptions;
}

const handleClarifai = async (req, res) => {
    const { input } = req.body;
    try {
        const clarifaiResponse = await fetch(
            "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
            returnClarifaiRequestOptions(input)
            );
        if (clarifaiResponse) {
            const faceData = await clarifaiResponse.json();
            return res.json(faceData);
        } else {
            return res.status(400).json('Unable to detect face');
        }
    } catch (error) {
        res.status(500).json('Internal server error');
    }
    

}

module.exports = {
    handleImage: handleImage,
    handleClarifai: handleClarifai
};
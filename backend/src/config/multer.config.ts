import { diskStorage } from 'multer';

const editFilename = (req, file, cb) => {
  try {
    const userData = JSON.parse(req.body.userData);
    const username: string =  userData.nickname;
    // const username = req.body.userData
    if (!username)
    {
      console.log("sorry, no username");
      cb(new Error('Le champ "username" est requis pour nommer le fichier.'), '');
    }
    else
    {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${username}.jpg`); // Nom du fichier basé sur le username
    }
  }
  catch (error) {
    console.log("Error:", error);
  }
};

export const multerConfig = {
  // dest: './uploads/', // Le répertoire où stocker les photos
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype.startsWith('image/')) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Le fichier n\'est pas une image.'), false);
  //   }
  // },
  storage: diskStorage({
    destination:'./uploads/',
    filename: editFilename,
  }),
};

document.addEventListener("DOMContentLoaded", () => {

    const imageInput =
        document.getElementById("imageInput");

    const chooseImageBtn =
        document.getElementById("chooseImageBtn");

    const changeImageBtn =
        document.getElementById("changeImageBtn");

    const imagePreview =
        document.getElementById("imagePreview");

    const previewContainer =
        document.getElementById("previewContainer");

    const uploadBox =
        document.getElementById("uploadBox");

    const uploadSection =
        document.getElementById("animalUploadSection");

    const uploadTitle =
        document.getElementById("uploadTitle");

    const uploadDescription =
        document.getElementById("uploadDescription");

    const analyzeBtn =
        document.getElementById("analyzeBtn");


    if (!imageInput) {
        return;
    }


    /* -----------------------------------------
       DETECTION TYPE
    ----------------------------------------- */

    const params =
        new URLSearchParams(window.location.search);

    const detectionType =
        params.get("mode") === "breed"
            ? "breed"
            : "disease";


    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const isAnimalSelectionPage =
        currentPage === "animal-selection.html";


    let selectedAnimal = null;
    let selectedFile = null;


    /* =========================================
       ANIMAL SELECTION PAGE
       ========================================= */

    if (isAnimalSelectionPage) {

        const animalCards =
            document.querySelectorAll(".animal-card");


        animalCards.forEach(card => {

            card.addEventListener("click", () => {

                selectedAnimal =
                    card.dataset.animal;


                localStorage.setItem(
                    "selectedAnimal",
                    selectedAnimal
                );


                sessionStorage.setItem(
                    "vetvisionDetectionType",
                    detectionType
                );


                /* Selected card */

                animalCards.forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });

                card.classList.add("selected");


                /* Show upload section */

                if (uploadSection) {

                    uploadSection.style.display =
                        "block";

                }


                /* Upload text */

                if (selectedAnimal === "dog") {

                    uploadTitle.textContent =
                        "Upload an image of your dog";

                    uploadDescription.textContent =
                        "Choose a clear image of the dog you want to analyze.";

                }

                else if (selectedAnimal === "cat") {

                    uploadTitle.textContent =
                        "Upload an image of your cat";

                    uploadDescription.textContent =
                        "Choose a clear image of the cat you want to analyze.";

                }

                else if (selectedAnimal === "cattle") {

                    uploadTitle.textContent =
                        "Upload an image of your cattle";

                    uploadDescription.textContent =
                        "Choose a clear image of the cattle you want to analyze.";

                }


                /* Reset previous image */

                selectedFile = null;

                imageInput.value = "";

                imagePreview.src = "";

                previewContainer.style.display =
                    "none";

                uploadBox.style.display =
                    "flex";

                analyzeBtn.disabled =
                    true;


                /* Open file picker immediately */

                imageInput.click();

            });

        });


        /* -----------------------------------------
           IMAGE SELECTED
        ----------------------------------------- */

        imageInput.addEventListener(
            "change",
            () => {

                const file =
                    imageInput.files?.[0];


                if (!file) {
                    return;
                }


                if (
                    !file.type.startsWith("image/")
                ) {

                    alert(
                        "Please select a valid image."
                    );

                    imageInput.value = "";

                    return;
                }


                selectedFile = file;


                /* Preview */

                imagePreview.src =
                    URL.createObjectURL(file);


                uploadBox.style.display =
                    "none";


                previewContainer.style.display =
                    "flex";


                analyzeBtn.disabled =
                    false;


                analyzeBtn.textContent =
                    "Analyze Image";

            }
        );


        /* -----------------------------------------
           CHOOSE IMAGE
        ----------------------------------------- */

        chooseImageBtn?.addEventListener(
            "click",
            () => {

                imageInput.click();

            }
        );


        /* -----------------------------------------
           CHANGE IMAGE
        ----------------------------------------- */

        changeImageBtn?.addEventListener(
            "click",
            () => {

                imageInput.click();

            }
        );


        /* -----------------------------------------
           ANALYZE
        ----------------------------------------- */

        analyzeBtn?.addEventListener(
            "click",
            async () => {

                if (!selectedAnimal) {

                    alert(
                        "Please select an animal first."
                    );

                    return;
                }


                if (!selectedFile) {

                    alert(
                        "Please select an image first."
                    );

                    return;
                }


                analyzeBtn.disabled =
                    true;

                analyzeBtn.textContent =
                    "Analyzing...";


                try {

                    /*
                     * Compress the image before storing it.
                     * This prevents sessionStorage from
                     * becoming too large.
                     */

                    const imageData =
                        await compressImage(
                            selectedFile
                        );


                    /* --------------------------------
                       SAVE RESULT
                    -------------------------------- */

                    const resultData = {

                        detectionType:
                            detectionType,

                        animalType:
                            selectedAnimal,

                        imageUrl:
                            imageData,

                        status:
                            "pending"

                    };


                    sessionStorage.setItem(
                        "vetvisionDetectionResult",
                        JSON.stringify(resultData)
                    );


                    /* --------------------------------
                       BREED RESULT
                    -------------------------------- */

                    if (
                        detectionType === "breed"
                    ) {

                        sessionStorage.setItem(
                            "vetvisionBreedResult",
                            JSON.stringify(resultData)
                        );

                    }


                    /* --------------------------------
                       GO TO RESULT
                    -------------------------------- */

                    goToResultPage(
                        detectionType
                    );

                }

                catch (error) {

                    console.error(
                        "VetVision Analyze Error:",
                        error
                    );


                    alert(
                        "The image is too large to process. Please choose another image."
                    );


                    analyzeBtn.disabled =
                        false;

                    analyzeBtn.textContent =
                        "Analyze Image";

                }

            }
        );


        /*
         * Stop here.
         */

        return;
    }


    /* =========================================
       OLD SEPARATE DETECTION PAGES
       ========================================= */

    const selectedAnimalFromStorage =
        localStorage.getItem(
            "selectedAnimal"
        );


    if (!selectedAnimalFromStorage) {

        window.location.href =
            "animal-selection.html";

        return;
    }


    selectedAnimal =
        selectedAnimalFromStorage;


    /* Choose image */

    chooseImageBtn?.addEventListener(
        "click",
        () => {

            imageInput.click();

        }
    );


    /* Change image */

    changeImageBtn?.addEventListener(
        "click",
        () => {

            imageInput.click();

        }
    );


    /* Image selected */

    imageInput.addEventListener(
        "change",
        () => {

            const file =
                imageInput.files?.[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please select a valid image."
                );

                imageInput.value = "";

                return;
            }


            selectedFile = file;


            imagePreview.src =
                URL.createObjectURL(file);


            if (uploadBox) {

                uploadBox.style.display =
                    "none";

            }


            if (previewContainer) {

                previewContainer.style.display =
                    "flex";

            }


            if (analyzeBtn) {

                analyzeBtn.disabled =
                    false;

                analyzeBtn.textContent =
                    "Analyze Image";

            }

        }
    );

});


/* =========================================
   RESULT PAGE
   ========================================= */

function goToResultPage(
    detectionType
) {

    if (
        detectionType === "breed"
    ) {

        window.location.href =
            "breed-result.html";

    }

    else {

        window.location.href =
            "disease-result.html";

    }

}


/* =========================================
   COMPRESS IMAGE
   ========================================= */

function compressImage(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                const img =
                    new Image();


                img.onload = () => {

                    const MAX_SIZE = 1200;

                    let width =
                        img.width;

                    let height =
                        img.height;


                    /* Resize large images */

                    if (width > MAX_SIZE ||
                        height > MAX_SIZE) {

                        if (width > height) {

                            height =
                                Math.round(
                                    height *
                                    MAX_SIZE /
                                    width
                                );

                            width =
                                MAX_SIZE;

                        }

                        else {

                            width =
                                Math.round(
                                    width *
                                    MAX_SIZE /
                                    height
                                );

                            height =
                                MAX_SIZE;

                        }

                    }


                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const context =
                        canvas.getContext(
                            "2d"
                        );


                    context.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );


                    /*
                     * JPEG quality 0.75 keeps
                     * the image clear while
                     * greatly reducing size.
                     */

                    const compressed =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.75
                        );


                    resolve(
                        compressed
                    );

                };


                img.onerror = () => {

                    reject(
                        new Error(
                            "Unable to process image."
                        )
                    );

                };


                img.src =
                    reader.result;

            };


            reader.onerror = () => {

                reject(
                    new Error(
                        "Unable to read image."
                    )
                );

            };


            reader.readAsDataURL(file);

        }
    );

}
const url =
  "https://script.google.com/macros/s/AKfycbyPd6rtHhEArC3yZOF_lpj3uhd78hkAWKjYeFtCPR8B39QZru3ANy-s75IvdXm4muGN/exec";

let form = document.getElementById("sheet_form");

const fileInput = document.querySelector('input[type="file"]');
let reader = new FileReader();
let image_url;

let loading = false;

const loading_element = document.querySelector(".loader_container");
const pop_up_container = document.querySelector(".pop_up_container");

function handleEvent(event) {
  if (event.type === "load") {
    // console.log(reader.result);
    let res = reader.result;
    let spt = res.split("base64,")[1];

    let obj = {
      base64: spt,
      type: fileInput.files[0].type,
      name: fileInput.files[0].name,
    };

    loading_element.classList.add("loading_true");

    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
    })
      .then((r) => r.text())
      .then((data) => {
        image_url = data;
        loading_element.classList.remove("loading_true");
      });
  }
}

function addListeners(reader) {
  reader.addEventListener("loadstart", handleEvent);
  reader.addEventListener("load", handleEvent);
  reader.addEventListener("loadend", handleEvent);
  reader.addEventListener("progress", handleEvent);
  reader.addEventListener("error", handleEvent);
  reader.addEventListener("abort", handleEvent);
}

fileInput.addEventListener("change", () => {
  const selectedFile = fileInput.files[0];

  if (selectedFile) {
    addListeners(reader);
    reader.readAsDataURL(selectedFile);
  }
});

const request_form_name = document.querySelector(".request_form_name");
const request_form_phone = document.querySelector(".request_form_phone");
const request_form_comment = document.querySelector(".request_form_comment");

const close_pop_up = document.querySelector(".pop_up_close");
const pop_up_content_main_img_container = document.querySelector(
  ".pop_up_content_main_img_container"
);

const main_text_title = document.querySelector(".main_text_title");
const main_text_sub_title = document.querySelector(".main_text_sub_title");

const img_element = document.createElement("img");

form.addEventListener("submit", (e) => {
  let form_body = new FormData(form);

  form_body.set("data[клиент был обслужен]", false);
  form_body.set("data[когда оставил заявку]", new Date());

  e.preventDefault();

  form_body.set("data[ссылка на фотографию]", image_url);

  if (request_form_phone.value !== "") {
    fetch(form.action, {
      method: "POST",
      body: form_body,
    }).then((res) => {
      request_form_name.value = "";
      request_form_phone.value = "";
      request_form_comment.value = "";

      if (res.status === 201) {
        pop_up_container.classList.add("pop_up_true");
        img_element.src = "./assets/success.svg";
        img_element.alt = "success_icon";

        main_text_title.innerHTML = "Ваша заявка принята";
        main_text_sub_title.innerHTML =
          "Мы скоро перезвоним вам по указаному номеру и обсудим все вопросы";
      } else {
        img_element.src = "./assets/warning.svg";
        img_element.alt = "warning_icon";

        main_text_title.innerHTML = "Произошла ошибка!";
        main_text_sub_title.innerHTML =
          "Попробуйте, заполнить форму снова через несколько минут";
      }
    });

    pop_up_content_main_img_container.append(img_element);
  }
});

close_pop_up.addEventListener("click", () => {
  pop_up_container.classList.remove("pop_up_true");
  img_element.remove();
});

function onlyNumberKey(evt) {
  // Only ASCII character in that range allowed
  var ASCIICode = evt.which ? evt.which : evt.keyCode;
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
  return true;
}

const header_button = document.querySelector(".header_button");

header_button.addEventListener("click", () => {
  console.log("first");
});

const order_button = document.querySelector(".order_button");
const client_number_request = document.querySelector(".client_number_request");

order_button.addEventListener("click", () => {
  if (client_number_request.value !== "") {
    img_element.src = "./assets/success.svg";
    img_element.alt = "success_icon";

    main_text_title.innerHTML = "Ваша заявка принята";
    main_text_sub_title.innerHTML =
      "Мы скоро перезвоним вам по указаному номеру и обсудим все вопросы";
  } else {
    img_element.src = "./assets/warning.svg";
    img_element.alt = "warning_icon";

    main_text_title.innerHTML = "Произошла ошибка!";
    main_text_sub_title.innerHTML =
      "Для того чтобы оставить запрос, пожалуйста укажите номер телефона";
  }
  pop_up_container.classList.add("pop_up_true");
  pop_up_content_main_img_container.append(img_element);

  client_number_request.value = "";
});

const burger = document.querySelector(".burger");
const sidebar_container = document.querySelector(".sidebar_container");

burger.addEventListener("click", () => {
  sidebar_container.classList.add("sidebar_opened");
});

sidebar_container.addEventListener("click", () => {
  sidebar_container.classList.remove("sidebar_opened");
});

"use strict";
const actions = document.querySelector(".actions");
const btnLogin = actions.querySelector(".btn__login");
const btnSignup = actions.querySelector(".btn__signup");
const btnMembers = document.querySelector(".btn__member");
const btnPosts = document.querySelector(".btn__post");

const welcomeMessage = document.querySelector(".welcome");
const btnCreatePost = document.querySelector(".create__post");

const form = document.querySelector(".form__create");
const btnSubmitPost = form.querySelector(".btn");
const postMessage = form.querySelector("textarea");

const modelPosts = document.querySelector(".posts");
const posts = modelPosts.querySelector(".post");

const empty = document.querySelector(".empty");

const modelMember = document.querySelector(".members__model");
const membersList = modelMember.querySelector(".members");

const modelSignup = document.querySelector(".signup__model");
const userInputNameSignup = modelSignup.querySelector("#name");
const userInputUsernameSignup = modelSignup.querySelector("#signup__username");
const userPasswordSignup = modelSignup.querySelector("#signup__password");
const btnSubmitSignup = modelSignup.querySelector(".btn__register");

const modelLogin = document.querySelector(".login__model");
const userInput = modelLogin.querySelector("#login__username");
const userPassword = modelLogin.querySelector("#login__password");
const btnSubmit = modelLogin.querySelector(".btn__submit");

const activeUser = document.querySelector(".user");
const btnLogout = activeUser.querySelector(".logout");

const notice = document.querySelector(".alert");

setTimeout(function () {
  notice.classList.add("show__model");
}, 1500);

setTimeout(function () {
  notice.classList.remove("show__model");
}, 7500);

let currentUser;
let currentUsername;
let currentUserId;
let id = 1;
let isLogged = false;

const avatarsColor = [
  "#f76707",
  "#f59f00",
  "#74b816",
  "#087f5b",
  "#f03e3e",
  "#4263eb",
];
const members = [
  { id: 1, name: "Admin", user: "admin", pass: "123", posts: 0 },
];

const membersPosts = [];

btnPosts.addEventListener("click", function () {
  if (!isLogged) return;
  if (!membersPosts.length) {
    toggleModel(empty, [form, modelMember, modelLogin, modelSignup]);
    return;
  }

  toggleModel(modelPosts, [form, modelMember, modelLogin, modelSignup]);

  empty.classList.remove("show__model");
  modelPosts.innerHTML = membersPosts
    .map((post) => {
      return `<div class="post">
           <div class="icon"></div>
           <div class="author">
            <p class="author__name">${post.memberName}</p>
            <p class="message">${post.post}</p>
          </div>
          <button class="btn edit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="bevel"
            >
              <path
                d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"
              ></path>
              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
            </svg>
          </button>
        </div>`;
    })
    .join("");
});

btnMembers.addEventListener("click", function () {
  if (!isLogged) return;
  toggleModel(modelMember, [empty, form, modelPosts, modelLogin, modelSignup]);

  membersList.innerHTML = members
    .map((member) => {
      return `<div class="member">
                <div class="icon">${member.name
                  .split("")[0]
                  .toUpperCase()}</div>
                  <div class="info">
                   <p class="member__name">${member.name}</p>
                   <p class="posts__count"><span>${
                     member.posts
                   }</span> Posts</p>
                </div>
            </div>`;
    })
    .join(" ");
});

btnSignup.addEventListener("click", function () {
  toggleModel(modelSignup, [empty, form, modelPosts, modelMember, modelLogin]);
});
btnLogin.addEventListener("click", function () {
  toggleModel(modelLogin, [form, modelPosts, modelMember, modelSignup]);
});

btnCreatePost.addEventListener("click", function () {
  toggleModel(form, [empty, modelLogin, modelPosts, modelMember, modelSignup]);
});

btnSubmit.addEventListener("click", function () {
  if (userInput.value === "" || userPassword.value == "") {
    hideModel(userInput, userPassword, modelLogin, 400);
    return;
  }

  const getUser = members.filter(
    (member) =>
      member.user === userInput.value && member.pass === userPassword.value
  );

  if (getUser.length < 1) {
    hideModel(userInput, userPassword, modelLogin, 400);
    return;
  }
  currentUserId = +getUser.map((user) => user.id);
  currentUser = getUser.map((user) => user.name).toString();
  currentUsername = userInput.value;
  renderCurrentUser();
  hideModel(userInput, userPassword, modelLogin, 200);
});

activeUser.addEventListener("mouseenter", function () {
  btnLogout.style.display = "block";
  modelMember.classList.remove("show__model");
});
activeUser.addEventListener("mouseleave", function () {
  btnLogout.style.display = "none";
});

btnLogout.addEventListener("click", function () {
  isLogged = false;
  currentUserId = undefined;

  modelPosts.classList.remove("show__model");
  btnCreatePost.classList.remove("show__model");
  form.classList.remove("show__model");
  empty.classList.remove("show__model");

  // 1. Hide the (current) logout button
  this.style.display = "none";
  // 2. Remove user avatar
  activeUser.querySelector(".icon").style.backgroundColor = "unset";
  // 3. Reset user inputs
  activeUser.querySelector(".info .info__personal--name").textContent = "";
  activeUser.querySelector(".info .info__username").textContent = "";
  // 4. Remove active user
  activeUser.classList.remove("flex");
  activeUser.style.display = "none";
  // 5. Display 'login' 'signup' buttons
  actions.style.display = "block";
});

btnSubmitSignup.addEventListener("click", function () {
  if (
    userInputNameSignup.value === "" ||
    userInputUsernameSignup.value === "" ||
    userPasswordSignup.value === ""
  ) {
    userPasswordSignup.value = "";
    hideModel(userInputNameSignup, userInputUsernameSignup, modelSignup, 400);
    return;
  }
  currentUser = userInputNameSignup.value;
  currentUsername = userInputUsernameSignup.value;
  renderCurrentUser();
  id++;
  members.push({
    id,
    name: userInputNameSignup.value,
    user: userInputUsernameSignup.value,
    pass: userPasswordSignup.value,
    posts: 0,
  });

  userPasswordSignup.value = "";
  hideModel(userInputNameSignup, userInputUsernameSignup, modelSignup, 400);
});

// Dublicate Usernames
userInputUsernameSignup.addEventListener("input", function () {
  const duplicate = members.filter(
    (m) => m.user === userInputUsernameSignup.value
  );
  if (duplicate.length > 0) {
    btnSubmitSignup.disabled = true;
    return;
  }
  btnSubmitSignup.disabled = false;
});

const hideModel = function (input1, input2, model, sec) {
  if (input1 || input2) input1.value = input2.value = "";
  setTimeout(() => model.classList.remove("show__model"), sec);
};

const toggleModel = (current, others) => {
  others.forEach((other) => other.classList.remove("show__model"));
  current.classList.add("show__model");
};

const renderCurrentUser = function () {
  isLogged = true;
  setTimeout(() => {
    btnCreatePost.classList.add("show__model");
    welcomeMessage.classList.add("hide");
  }, 500);

  // 1. Generate a new avatar
  activeUser.querySelector(".icon").style.backgroundColor =
    avatarsColor[Math.floor(Math.random() * avatarsColor.length)];

  // 2. Render new active user's data
  activeUser.querySelector(".info .info__personal--name").textContent =
    currentUser.split("")[0].toUpperCase() + currentUser.slice(1);
  activeUser.querySelector(
    ".info .info__username"
  ).textContent = `@${currentUsername}`;

  // 3.avatar logo (Logo will be the first letter of his/her name)
  activeUser.querySelector(".icon").textContent = currentUser
    .split("")[0]
    .toUpperCase();

  // 4. display current user
  activeUser.style.display = "block";
  activeUser.classList.add("flex");

  // 5. Hide 'register' and 'login' btn's
  actions.style.display = "none";
};

const generateAvatar = function () {
  // 1. random color for avatars
  activeUser.querySelector(".icon").style.backgroundColor =
    avatarsColor[Math.floor(Math.random() * avatarsColor.length)];

  // 2.avatar logo (Logo will be the first letter of his/her name)
  activeUser.querySelector(".icon").textContent = currentUser
    .split("")[0]
    .toUpperCase();
};

// hanlde form input
btnSubmitPost.addEventListener("click", function () {
  const post = form.querySelector("textarea").value;
  if (post === "") {
    form.classList.remove("show__model");
    return;
  }

  if (currentUserId === undefined) {
    const updatePostlen = members.filter((member) => member.id === id);
    updatePostlen.forEach((postCount) => postCount.posts++);
    membersPosts.push({ memberId: id, memberName: currentUser, post });
  } else {
    const updatePostlen = members.filter(
      (member) => member.id === currentUserId
    );
    updatePostlen.forEach((postCount) => postCount.posts++);
    membersPosts.push({
      memberId: currentUserId,
      memberName: currentUser,
      post,
    });
  }

  form.querySelector("textarea").value = "";
  form.classList.remove("show__model");
});

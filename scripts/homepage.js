const serverUrl = "https://striveschool-api.herokuapp.com/api/product/";
const apiValue =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4ODI5ZDY4NWVjNDAwMTQ1MGJjZDciLCJpYXQiOjE2OTI5NTkzODksImV4cCI6MTY5NDE2ODk4OX0.ohesj5ZWa_LS-OtWXZfPBdjC17b5SUhJi4ge_gwaKZk";

const productsGrid = document.getElementById("available-products");

window.onload = async () => {
  const re = await fetch(serverUrl, {
    headers: {
      Authorization: apiValue,
    },
  });
  if (!re.ok) {
    throw new Error("error");
  }
  const products = await re.json();
  document.querySelector(".spinner-border").className = "d-none";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.className = "card-img-top";
    card.appendChild(img);
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    card.appendChild(cardBody);
    const title = document.createElement("h5");
    title.className = "card-title";
    title.innerText = product.name;
    cardBody.appendChild(title);
    const price = document.createElement("p");
    price.className = "card-text";
    price.innerText = "$" + product.price;
    cardBody.appendChild(price);
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-primary btn-sm mb-2";
    editBtn.innerText = "modifica";
    editBtn.addEventListener("click", () => editProduct(product._id));
    cardBody.appendChild(editBtn);
    const moreBtn = document.createElement("a");
    moreBtn.className = "btn btn-primary btn-sm";
    const detailsLink = "./details.html" + "?productId=" + product._id;
    moreBtn.setAttribute("href", detailsLink);
    moreBtn.innerText = "Scopri di più";
    cardBody.appendChild(moreBtn);
    const col = document.createElement("div");
    col.className = "col d-flex";
    col.appendChild(card);
    productsGrid.appendChild(col);
  });
};

const editProduct = id => {
  window.location.assign("./back-office.html" + "?id=" + id);
};

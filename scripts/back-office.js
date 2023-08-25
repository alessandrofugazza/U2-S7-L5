const productForm = document.querySelector("form");
const serverUrl = "https://striveschool-api.herokuapp.com/api/product/";
const apiValue =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4ODI5ZDY4NWVjNDAwMTQ1MGJjZDciLCJpYXQiOjE2OTI5NTkzODksImV4cCI6MTY5NDE2ODk4OX0.ohesj5ZWa_LS-OtWXZfPBdjC17b5SUhJi4ge_gwaKZk";

const addedProductsList = document.getElementById("added-products");

let editing = null;

const addToProductsList = product => {
  const li = document.createElement("li");
  const div = document.createElement("div");
  const p = document.createElement("p");
  const editBtn = document.createElement("button");
  p.className = "d-inline-block me-2";
  p.innerText = product.name;
  div.appendChild(p);
  editBtn.className = "btn btn-primary btn-sm align-baseline";
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", () => {
    editing = editBtn.parentElement;
    editProduct(product);
  });
  div.appendChild(editBtn);
  li.appendChild(div);
  addedProductsList.appendChild(li);
};

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
  products.forEach(product => addToProductsList(product));
  const editFromHomepage = new URLSearchParams(window.location.search).get("id");
  if (editFromHomepage) {
    const re = await fetch(serverUrl + "/" + editFromHomepage, {
      headers: {
        Authorization: apiValue,
      },
    });
    if (!re.ok) {
      throw new Error("error");
    }
    const productToEdit = await re.json();
    const addedProductsNames = addedProductsList.querySelectorAll("p");
    for (let i = 0; i < addedProductsNames.length; i++) {
      if (productToEdit.name === addedProductsNames[i].innerText) {
        editing = addedProductsNames[i].parentElement;
        break;
      }
    }
    editProduct(productToEdit);
  }
};

productForm.addEventListener("submit", async e => {
  e.preventDefault();
  editing = null;
  const data = {
    name: e.target["productName"].value,
    description: e.target["productDescription"].value,
    brand: e.target["productBrand"].value,
    imageUrl: e.target["productImage"].value,
    price: e.target["productPrice"].value,
  };
  const re = await fetch(serverUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiValue,
    },
    body: JSON.stringify(data),
  });
  if (!re.ok) {
    throw new Error("error");
  }
  const newProduct = await re.json();
  addToProductsList(newProduct);
  resetFields();
});

const editProduct = data => {
  removeEditButtons();
  productForm["productName"].value = data.name;
  productForm["productDescription"].value = data.description;
  productForm["productBrand"].value = data.brand;
  productForm["productImage"].value = data.imageUrl;
  productForm["productPrice"].value = data.price;
  const editBtn = document.createElement("button");
  editBtn.setAttribute("type", "button");
  editBtn.className = "btn btn-warning edit-buttons ms-4";
  editBtn.innerText = "Save changes";
  editBtn.addEventListener("click", () => saveChanges(data));
  productForm.appendChild(editBtn);
  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("type", "button");
  deleteBtn.className = "btn btn-danger edit-buttons ms-2";
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    deleteProduct(data);
  });
  productForm.appendChild(deleteBtn);
};

const removeEditButtons = () => {
  const btns = document.querySelectorAll(".edit-buttons");
  btns.forEach(btn => btn.remove());
};

const saveChanges = async data => {
  const newData = {};
  if (productForm["productName"].value !== data.name) {
    newData.name = productForm["productName"].value;
    data.name = newData.name;

    editing.querySelector("p").innerText = newData.name;
  }
  if (productForm["productDescription"].value !== data.description) {
    newData.description = productForm["productDescription"].value;
    data.description = newData.description;
  }
  if (productForm["productBrand"].value !== data.brand) {
    newData.brand = productForm["productBrand"].value;
    data.brand = newData.brand;
  }
  if (productForm["productImage"].value !== data.imageUrl) {
    newData.imageUrl = productForm["productImage"].value;
    data.imageUrl = newData.imageUrl;
  }
  if (productForm["productPrice"].value !== data.price) {
    newData.price = productForm["productPrice"].value;
    data.price = newData.price;
  }
  const productUrl = serverUrl + "/" + data._id;
  const re = await fetch(productUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiValue,
    },
    body: JSON.stringify(newData),
  });
  if (!re.ok) {
    throw new Error("error");
  }
  editing = null;
  removeEditButtons();
  resetFields();
};

const deleteProduct = async data => {
  const productUrl = serverUrl + "/" + data._id;
  const re = await fetch(productUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiValue,
    },
  });
  if (!re.ok) {
    throw new Error("error");
  }
  editing.parentElement.remove();
  removeEditButtons();
  resetFields();
};

const formFields = productForm.querySelectorAll("input");
const resetBtn = document.getElementById("reset-btn");

const resetFields = () => {
  formFields.forEach(field => (field.value = ""));
};

resetBtn.addEventListener("click", () => {
  if (!confirm("Are you sure you want to reset the form? This action cannot be undone.")) {
    return;
  }
  resetFields();
});

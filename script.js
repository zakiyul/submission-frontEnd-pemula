let books = [];

const BOOK_LOCALSTORAGE_KEY = "RAK_BUKU";
const RENDER_COMPONENTS = "renderKomponen";

const unfinishBookElement = document.getElementById('belum-selesai');
const finishBooksElement = document.getElementById('sudah-selesai');

const cariByJudul = document.getElementById('judul-cari');
const submitBook = document.getElementById('form-input-book');
const submitEditBook = document.getElementById('form-edit-book');
const submitBookBtn = document.getElementById('submit-book');
const formInput = document.getElementById('input-book');
const formEdit = document.getElementById('edit-book');
const editBtn = document.getElementById('edit-book-btn');

// FUNCTION 
function haveStorage(){
    if(typeof Storage === undefined){
        alert("Browser tidak mendukung web storage. Ganti ke Browser lain :(");
        return false
    }

    return true;
}

function saveData(){
    if(haveStorage()){
        const booksStringify = JSON.stringify(books);
        localStorage.setItem(BOOK_LOCALSTORAGE_KEY, booksStringify);
    }
}

function getEditData(bookId){
    const bookUpdate = books.find(function(book){
        return book.id === bookId
    });

    formInput.style.display = 'none';
    formEdit.style.display = 'block';

    document.getElementById('id-buku').value = bookUpdate.id;
    document.getElementById('judul-edit').value = bookUpdate.judul;
    document.getElementById('penulis-edit').value = bookUpdate.penulis;
    document.getElementById('tahun-edit').value = bookUpdate.tahun;
    document.getElementById('selesai-edit').checked = bookUpdate.isSelesai;
    

}
  
function findBookIdx(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function createNewBook(book){
    const bookEl = document.createElement("div");
    const articleEl = document.createElement("article");
    const asideEl = document.createElement("aside");
    const h4El = document.createElement('h4');
    const ulEl = document.createElement('ul');
    const li_penulis = document.createElement('li');
    const li_tahun = document.createElement('li');
    const btnHapus = document.createElement('button');
    const btnIsSelesai = document.createElement('button');
    const btnUpdate = document.createElement('button');

    btnUpdate.innerHTML = '<i class="bi bi-pencil-square"></i>';
    btnUpdate.setAttribute("class", "selesai-baca");
    btnUpdate.addEventListener('click', function(e){
        getEditData(book.id)
    })

    btnIsSelesai.setAttribute("class", "selesai-dibaca");


    if(book.isSelesai){
        btnIsSelesai.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
        btnIsSelesai.addEventListener('click', function(e){
            handleUnfinish(book.id);
        })
    }else{
        btnIsSelesai.innerHTML = '<i class="bi bi-check2-circle"></i>';
        btnIsSelesai.addEventListener('click', function(e){
            handleFinish(book.id)
        })
    }


    btnHapus.innerHTML = '<i class="bi bi-trash3"></i>';
    btnHapus.setAttribute("class", "hapus-buku");

    btnHapus.addEventListener('click', function(e){
        deleteBook(book.id)
    })

    li_penulis.innerHTML = `<small><strong>Penulis</strong>: ${book.penulis}</small>`;
    li_tahun.innerHTML = `<small><strong>Tahun</strong>: ${book.tahun}</small>`;
    h4El.innerText = book.judul;
    
    ulEl.appendChild(li_penulis);
    ulEl.appendChild(li_tahun);

    articleEl.appendChild(h4El);
    articleEl.appendChild(ulEl);

    asideEl.appendChild(btnIsSelesai);
    asideEl.appendChild(btnUpdate);
    asideEl.appendChild(btnHapus);

    bookEl.appendChild(articleEl);
    bookEl.appendChild(asideEl);


    bookEl.classList.add("book");

    return bookEl;
}

function readBook(){
    const booksFromStorage = localStorage.getItem(BOOK_LOCALSTORAGE_KEY);
    const booksParsed = JSON.parse(booksFromStorage);

    if(booksParsed !== null){
        for(let book of booksParsed){
            books.unshift(book)
        }
    }
    
    document.dispatchEvent(new Event(RENDER_COMPONENTS));
}

function updateBook(){
    const bookEditIdx = document.getElementById('id-buku').value;
    deleteBook(bookEditIdx);
    
    
    const newBook = {
        id: +new Date(),
        judul: document.getElementById('judul-edit').value,
        penulis: document.getElementById('penulis-edit').value,
        tahun: document.getElementById('tahun-edit').value,
        isSelesai: document.getElementById('selesai-edit').checked
    };

    books.unshift(newBook);
    document.dispatchEvent(new Event(RENDER_COMPONENTS));
    saveData();
}

function deleteBook(bookId){
    const bookIndex = findBookIdx(bookId);
    books.splice(bookIndex, 1)

    document.dispatchEvent(new Event(RENDER_COMPONENTS));
    saveData();
}

function addNewBook(){
    let judul = document.getElementById("judul").value;
    let penulis = document.getElementById("penulis").value;
    let tahun = document.getElementById("tahun").value;
    let selesai = document.getElementById("selesai").checked;

    const newBook = {
        id: +new Date(),
        judul,
        penulis,
        tahun,
        isSelesai: selesai
    }

    document.getElementById("judul").value = "";
    document.getElementById("penulis").value = "";
    document.getElementById("tahun").value = "";
    document.getElementById("selesai").checked = false;

    books.unshift(newBook);
    document.dispatchEvent(new Event(RENDER_COMPONENTS));
    saveData()
}

function handleFinish(bookId){
    const bookFinish = books.find(function(book){
        return book.id === bookId
    })

    bookFinish.isSelesai = true;
    document.dispatchEvent(new Event(RENDER_COMPONENTS));
    saveData();
}

function handleUnfinish(bookId){
    const bookUnfinish = books.find(function(book){
        return book.id === bookId
    });
    if(bookUnfinish == null);

    bookUnfinish.isSelesai = false;
    document.dispatchEvent(new Event(RENDER_COMPONENTS));
    saveData()
}

function handleSearch(judul){
    const judulFound = books.filter(function(book){
        return book.judul.toUpperCase().includes(judul.toUpperCase())
    })

    if(judul){
        books = []
        books = judulFound
    }else{
        const booksFromStorage = localStorage.getItem(BOOK_LOCALSTORAGE_KEY);
        const booksParsed = JSON.parse(booksFromStorage);
        books = booksParsed
    }

    document.dispatchEvent(new Event(RENDER_COMPONENTS))
}
// END FUNCTION



// EVENT LISTENER 
cariByJudul.addEventListener('change', function(e){
    const targetValue = e.target.value;
    handleSearch(targetValue)
})

editBtn.addEventListener('click', function(e){
    formInput.style.display = 'block';
    formEdit.style.display = 'none';
})

submitBook.addEventListener('submit', function(e){
    e.preventDefault();
    addNewBook();
})

submitEditBook.addEventListener('submit', function(e){
    e.preventDefault();
    updateBook();
})

document.addEventListener("DOMContentLoaded", function(){
    formEdit.style.display = "none";
    if(haveStorage()){
        readBook()
    }
})

document.addEventListener(RENDER_COMPONENTS, function(){
    finishBooksElement.innerHTML = "";
    unfinishBookElement.innerHTML = "";

    for(let book of books){
        const bookElement = createNewBook(book);

        if(book.isSelesai){
            finishBooksElement.append(bookElement)
        }else{
            unfinishBookElement.append(bookElement)
        }
    }


})
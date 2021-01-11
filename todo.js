const form           = document.querySelector("#todo-form");
const todoInput      = document.querySelector("#todo");
const todoList       = document.querySelector(".list-group");
const firstCardBody  = document.querySelectorAll(".card-body")[0];  //2 tane card body miz old için 0.index olanı alıyoruz.
const secondCardBody = document.querySelectorAll(".card-body")[1];  //2 tane card bodyden 1.index olanı alıyoruz.
const filter         = document.querySelector("#filter");
const clearButton    = document.querySelector("#clear-todos");
//Yukarıda sayfadaki her elementi sırayla seçtik.

eventListeners();


function eventListeners(){
    form.addEventListener("submit",addTodo);

    //sayfa açıldığında local storage de bulunan todoları yüklemek için.
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);

    //ikinci card body de cllick event olduğundan delete fonksiyonum çalışsın.
    secondCardBody.addEventListener("click",deleteTodo);

    //filtreleme kısmını oluşturuyoruz.
    filter.addEventListener("keyup",filterTodos);


    //silme kısmını oluşturuyoruz..
    clearButton.addEventListener("click",clearAllTodos);

}

function clearAllTodos(e){
    //arayüzden todoları temizle.
    //butona basınca bir tane confirm kutusu açarız.Eğer kullanıcı okey e basarsa sileriz.Cansel a basarsa silmeyiz.
    if(confirm("Tümünü silmek istediğinize emin misiniz ?"))
    {
        while(todoList.firstElementChild!=null)
        {
            todoList.removeChild(todoList.firstElementChild);//her seferinde ilk çocuğu sil yani her seferinde en üstteki silinecek ve ikinci sıradaki ilk olacak gibi...
        
        }

        //bir de local storage dan kaldırmak gerekiyor.Bunun için key i silerek kaldırabiliriz.
        //key miz adı todos dı.
        localStorage.removeItem("todos");
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();                   //küçük-büyük harf duyarlılığını engellemek için.
    const listItems   = document.querySelectorAll(".list-group-item");  //list grubunu seçtik.

    //seçtiğimiz list grup üzerindeki li lerde tek tek gezmemiz gerekiyor.
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();

        //şimdi şunu yapmaya çalışıyoruz: "balıkesir".indexOf("ba") ba yazınca balıkesir vb kelimeler gelicekç Yoksa gelmeyecek.
        if(text.indexOf(filterValue)===-1){
            //BULAMADI...

            listItem.setAttribute("style","display:none !important");//bulamadıysan sayfada gösterme
        }
        else{
            listItem.setAttribute("style","display:block");//bulduysan sayfada göster
        }

    })
}

function deleteTodo(e)
{
    // <i class = "fa fa-remove"></i> BUNA TIKLADIĞIMIZDA İŞLEMİN GERÇEKLEŞECEĞİNİ ANLATMAMIZ GEREKİYOR.
    if(e.target.className==="fa fa-remove")
    {
   /*<li class="list-group-item d-flex justify-content-between">
        Todo 1
        <a href  = "#" class = "delete-item">
        <i class = "fa fa-remove"></i>
        </a>
    </li>*/
    //yukarıda index.html den aldığım parent elementleri oluşturcam. Bu icon un li ve a olarak 2 parent elementi var.
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo Başarıyla Silindi...");

    }
}

function deleteTodoFromStorage(deletetodo){
    //todo ları sayfa açıldığında siliyorduk.Ama local storage den silinmiyordu.Şimdi bunu silicez.
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo===deletetodo)
        {
            todos.splice(index,1);//arrayden todo silmek
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}

function loadAllTodosToUI(){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){//forEach sayesinde tüm listeyi tek tek gezip ekleme yapıcak sayfa yüklendiğinde
        addTodoToUI(todo);
    })
}

function showAlert(type,message)
{
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;  //showAlerti projenin diğer kısımlarında da kullanmak için böyle bir fonksiyon oluşturduk.
    //type yerine danger ise o, success ise o gelicek.

    alert.textContent = message;  //aynı şekilde mesaj da dinamikm olarak eklendi.Farklı yerlerde kullanılsın diye.

    firstCardBody.appendChild(alert);

    //setTimeout: belli bir saniye vermemizi sağlar.Alertin belli bir zaman sonra gitmesini istiyoruz.
    setTimeout(function() {
        alert.remove();
    }, 1000);//1 sn sonra silinsin.


}
function getTodosFromStorage(){
       //local storage e eklemek.
       let todos;
       if(localStorage.getItem("todos")===null)
       {
           todos = [];  //eğer bir todo girilmediyse boş başlat.
       }
       else
       {
           todos = JSON.parse(localStorage.getItem("todos"));
       }
       return todos;
}

function addTodoToStorage(newTodo)
{
    let todos = getTodosFromStorage();

    todos.push(newTodo);
    
    localStorage.setItem("todos",JSON.stringify(todos));//JSON.stringify(todos) array e string veri eklemek.
}

function addTodo(e){
    const newTodo = todoInput.value.trim();  /*trim ile todoInput a yazılan text in başındaki ve sonundaki boşlukları silmiş oluyoruz. */

    if(newTodo==="")
    {

    /*<div class="alert alert-danger" role="alert">
        This is a danger alert—check it out!
      </div>* ALERTİ BUNA GÖRE OLUŞTURMALIYIZ.*/
        showAlert("danger","Lütfen bir aktivite giriniz.");
    }


    else{
        addTodoToUI(newTodo);//arayüze bu todo eklensin.

        /*eklenen aktiviteleri local storage e eklemek. */
        addTodoToStorage(newTodo);

        showAlert("success","Başarıyla Eklendi.");
    } 
    e.preventDefault();
}

function copyItemRemove(){
  /*  else if(todos.forEach(function(todo)
    {
        if(newTodo!=todo)
        {
            addTodoToUI(newTodo);
        }
     
    }))*/

    
    // function sil(){

    //     var el = document.getElementById("test");
        
    //     el.parentNode.removeChild(el);
        
    //     }


    // let todos=getTodosFromStorage();

    // todos.forEach(function(todo){
    //     addTodoToUI(todo);
    // })
}


function addTodoToUI(newTodo){//string değerini list item olarak UI ya ekle.


//     <li class="list-group-item d-flex justify-content-between">
//     Todo 1
//     <a href = "#" class ="delete-item">
//         <i class = "fa fa-remove"></i>
//     </a>

// </li>//Aşağıda sırayla bu kısmı oluşturucaz.



    
    /*List Item oluşturmak */

    const listItem = document.createElement("li");

    /*Link oluşturmak */
    const link = document.createElement("a");

    link.href          = "#";
    link.className     = "delete-item";
    link.innerHTML     = "<i class='fa fa-remove'></i>";
    listItem.className = "list-group-item d-flex justify-content-between";
   

    /*Text Node Ekleme */
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    /*Todo List'e List Item Eklemek=>yani li ler ul ye eklenicek */
    todoList.appendChild(listItem);
    todoInput.value = "";


}
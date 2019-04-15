$(document).ready(function () {
    $("#btnLogin").click(function () {
        $.ajax({
            url: 'https://services.odata.org/V3/Northwind/Northwind.svc/Employees?%24format=json',
            dataType: "json",
            success: function (result) {
                console.log(result);
                let finalResult = result.value;
                let username = document.getElementById('username').value;
                let password = document.getElementById('password').value;

                for (let i = 0; i < finalResult.length; i++) {
                    if (username == finalResult[i].FirstName) {
                        if (password == finalResult[i].LastName) {
                            window.location.assign('index.html')
                        } else {
                            document.getElementById('username').style.border = '1px solid #ccc';
                            document.getElementById('password').style.border = '1px solid red';
                            document.getElementById('password').value = "";
                            return
                        };
                    } else {
                        document.getElementById('username').style.border = '1px solid red';
                    }
                }
            },
            error: function (error) {
                console.error(error);
            }
        })
    })
})
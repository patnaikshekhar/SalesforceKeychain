// Used to Open browser windows
const opn = require('opn');

// Use FS to create login.html file
const fs = require('fs');

function createPage(url, username, password) {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <body>
                
                <form method="post" action="${url}/index.jsp">
                    <input type="hidden" name="un" id="username" value="${username}" />
                    <input type="hidden" name="pw" id="password" value="${password}"/>
                </form>
                
                <script>
                    document.onreadystatechange = function() {    
                        document.forms[0].submit();    
                    };
                </script>
            </body>
        </html>
    `    
};

module.exports = function(url, username, password) {
    fs.writeFile(`${ __dirname }/login.html`, createPage(url, username, password), (err) => {
        if (!err) {
            opn(`file://${__dirname}/login.html`, { app: 'google chrome'});
        }    
    });
}


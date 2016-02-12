// Used to Open browser windows
const opn = require('opn');
const launcher = require( 'browser-launcher2' );

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

module.exports = function(settings, url, username, password) {
    fs.writeFile(`${ __dirname }/login.html`, createPage(url, username, password), (err) => {
        if (!err) {
            launcher.detect( function(available) {
                const browserSetting = settings.browser ? settings.browser.toLowerCase() : 'safari';
                console.log('browserSetting', browserSetting);
                const filteredBySettings = available
                    .filter((browser) => browser.name.toLowerCase() == browserSetting)
                    .map((browser) => browser.command);
                
                console.log('filteredBySettings', filteredBySettings[0]);
                
                if (filteredBySettings.length >= 1) {
                    opn(`file://${__dirname}/login.html`, { app: filteredBySettings[0] });    
                }
            });
        }    
    });
}


import React from 'react';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class SelectBrowser extends React.Component {
    
    componentWillMount() {
        this.setState({
            browsers: [],
            defaultBrowser: undefined
        });
        
        ipcBrowsers.getBrowsers((browsers, selected) => {
            this.setState({
                browsers: browsers,
                defaultBrowser: selected
            });
        });      
    }
    
    setBrowser(browser, e) {
        ipcBrowsers.setDefaultBrowser(browser, () => {
            this.setState(Object.assign(this.state, {
                defaultBrowser: browser
            }));    
        });
    }
    
    render() {
        
        let browsers = this.state.browsers.map(b => 
            <tr key={b}>
                    <td><input type="radio" name="browser" onChange={this.setBrowser.bind(this, b)} checked={b == this.state.defaultBrowser } /></td>
                    <td>{ capitalizeFirstLetter(b) }</td>
            </tr>
        );
        
        return (
            <div>
                <h1>Select Browser</h1>
                <table className="slds-table slds-table--bordered">
                    <thead className="slds-text-heading--label">
                    </thead>
                    <tbody className="account-list-table-body">
                        { browsers }   
                    </tbody>
                </table>
            </div>
        );
    }
}
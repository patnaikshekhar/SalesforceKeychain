import React from 'react';
import Store from './store';
import { Link } from 'react-router';

export default class AccountListItem extends React.Component {
    
    openTab() {
        Store.updateLastAccessed(this.props.id);
        Helper.openWindow(this.props.url, this.props.username, this.props.password);   
    }
    
    deleteRecord() {
        Store.deleteAccount(this.props.id);
    }
    
	render() {
		return (
			<tr>
				<td className="slds-lookup__item">
                    <a id="s01" href="#" role="option" onClick={ this.openTab.bind(this) }>
                        {this.props.environment == 'Production' ? 
                        <svg aria-hidden="true" className="slds-icon slds-icon-standard-article slds-icon--small">
                            <use xlinkHref="./assets/icons/standard-sprite/svg/symbols.svg#account"></use>
                        </svg>
                        :
                        (this.props.environment == 'Sandbox' ?
                        <svg aria-hidden="true" className="slds-icon slds-icon-standard-feed slds-icon--small">
                            <use xlinkHref="./assets/icons/standard-sprite/svg/symbols.svg#insights"></use>
                        </svg> : 
                        <svg aria-hidden="true" className="slds-icon slds-icon-standard-event slds-icon--small">
                            <use xlinkHref="./assets/icons/standard-sprite/svg/symbols.svg#custom"></use>
                        </svg>
                        )
                        }<span>{this.props.name}</span>&nbsp;
                    </a>
			    </td>
			    <td>
                    <Link to={`/add/${this.props.id}`}>
                        <button className="slds-button slds-button--neutral slds-button--small">
                            <svg aria-hidden="true" className="slds-button__icon--stateful">
                                <use xlinkHref="./assets/icons/utility-sprite/svg/symbols.svg#edit"></use>
                            </svg>
                        </button>
                    </Link>
                    <button className="slds-button slds-button--destructive slds-button--small slight-margin-left" onClick={ this.deleteRecord.bind(this) }>
                        <svg aria-hidden="true" className="slds-button__icon--stateful">
                            <use xlinkHref="./assets/icons/utility-sprite/svg/symbols.svg#delete"></use>
                        </svg>
                    </button>
			        <button className="slds-button slds-button--brand slds-button--small" onClick={ this.openTab.bind(this) }>Open</button>
				</td>
			</tr>
		);
	}
}
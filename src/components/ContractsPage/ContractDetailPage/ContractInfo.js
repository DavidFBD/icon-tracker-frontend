import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    CopyButton,
    TransactionLink,
    LoadingComponent,
    QrCodeButton,
    AddressLink
} from 'components'
import {
    convertNumberToText,
    numberWithCommas,
    tokenText,
} from 'utils/utils'
import {
    CONTRACT_STATUS,
    IRC_VERSION
} from 'utils/const'

class ContractInfo extends Component {

    componentDidMount() {
        setTimeout(() => {
            const event = new CustomEvent('CUSTOM_FX', { detail: "CONTRACT" })
            window.dispatchEvent(event)    
        }, 500)
    }

    render() {
        const { contract } = this.props
        const { loading, data } = contract
        const Contents = () => {
            if (loading) {
                return <LoadingComponent height='206px' />
            }
            else {
                const { address, balance, createTx, creator, ircVersion, status, symbol, txCount, usdBalance, tokenName } = data
                return (
                    <div className="screen0">
                        <div className="wrap-holder">
                            <p className="title">Contract</p>
                            <div className="contents">
                                <table className="table-typeB contract">
                                    <tbody>
                                        <tr className="qr">
                                            <td>Address</td>
                                            <td colSpan="3">{address} <QrCodeButton address={address} /><CopyButton data={address} title={'Copy Address'} isSpan /></td>
                                        </tr>
                                        <tr>
                                            <td>Balance</td>
                                            <td>{convertNumberToText(balance, 'icx')} ICX{/*<span className="gray">({convertNumberToText(usdBalance, 'usd')} USD)</span>*/}</td>
                                            <td>Token Contract</td>
                                            <TokenContractCell tokenName={tokenName} symbol={symbol} address={address} ircVersion={ircVersion} />
                                        </tr>
                                        <tr>
                                            <td>ICX Value</td>
                                            <td>{convertNumberToText(usdBalance, 'usd')} USD</td>
                                            <td>Contract Creator</td>
                                            <td>
                                                <span className="link address ellipsis"><AddressLink to={creator} /></span><em>at Txn</em><TransactionLink to={createTx} spanClassName="link hash ellipsis" />
                                                <span className="help address">Creator Address</span>
                                                <span className="help hash">Creator Transaction Hash</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Transactions</td>
                                            <td>{numberWithCommas(txCount)} Txns</td>
                                            <td>Status</td>
                                            <td>{CONTRACT_STATUS[status]}
                                                <DetailButton contractAddr={address} contractDetailPopup={this.props.contractDetailPopup} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        return Contents()
    }
}

class DetailButton extends Component {

    handleClick = () => {
        const { contractAddr } = this.props
        this.props.contractDetailPopup({ contractAddr })
    }

    render() {
        return (
            <button onClick={this.handleClick} className="btn-type-normal status">Detail</button>
        )
    }
}

const TokenContractCell = ({ tokenName, symbol, address, ircVersion }) => {
    if (ircVersion === IRC_VERSION[1]) {
        return (
            <td>
                {tokenText(tokenName, symbol, address, false, "link token")}
                <span className="help token">{ircVersion} - {address}</span>
            </td>
        )
    }
    else {
        return <td>-</td>
    }
}

export default withRouter(ContractInfo);

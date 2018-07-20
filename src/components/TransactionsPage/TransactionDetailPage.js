import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { dateToUTC, convertNumberToText, numberWithCommas, startsWith, utcDateInfo, isContractAddress, isVaildData } from '../../utils/utils';
import { BlockLink, WalletLink, NotFound, CopyButton } from '../../components/';

class TransactionDetailPage extends Component {

	componentWillMount() {
		this.allDetailInfo(this.props.url.pathname)
	}

	componentWillReceiveProps(nextProps) {
		const current = this.props.url.pathname
		const next = nextProps.url.pathname
		if (current !== next && startsWith(next, '/contract')) {
			this.allDetailInfo(next)
		}
	}

	allDetailInfo = (pathname) => {
		const txHash = pathname.split("/")[2]
		if (txHash) {
			this.props.transactionTxDetail({ txHash });			
		}
	}

	render() {
		console.log(this.props)

		const { transaction } = this.props;
		const { loading, data, error } = transaction;
		const { txHash, status, createDate, height, confirmation, fromAddr, toAddr, amount, stepLimit, stepUsedByTxn, stepPrice, dataString, fee, feeUsd } = data

		if (!loading && error) {
			return (
				<NotFound error={error} />
			)
		}
		else {
			return (
				<div className="content-wrap">
					<div className="screen0">
						<div className="wrap-holder">
							<p className="title">Transaction</p>
							<div className="contents">
								<table className="table-typeB transaction">
									<tbody>
										<tr>
											<td>TxHash</td>
											<td>{txHash}<CopyButton data={txHash} title={'Copy TxHash'} isSpan/></td>
										</tr>
										<tr>
											<td>Status</td>
											<td>{status}</td>
										</tr>
										<tr>
											<td>Block Height</td>
											<td><span><BlockLink to={height} /></span><em>{`(${numberWithCommas(confirmation)} Confirmations)`}</em></td>
										</tr>
										<tr>
											<td>Time Stamp</td>
											<td>{dateToUTC(createDate)}<em>{utcDateInfo(createDate)}</em></td>
										</tr>
										<tr>
											<td>From</td>
											<AddressCell address={fromAddr} />
										</tr>
										<tr>
											<td>To</td>
											<AddressCell address={toAddr} />
										</tr>
										<tr>
											<td>Amount</td>
											<td>{`${convertNumberToText(amount, 'icx')} ICX`}</td>
										</tr>
										<tr>
											<td>STEP limit</td>
											<td>{`${convertNumberToText(stepLimit, 'icx')} ICX`}</td>
										</tr>
										<tr>
											<td>STEP used by Txn</td>
											<td>{`${convertNumberToText(stepUsedByTxn, 'icx')} ICX`}</td>
										</tr>
										<tr>
											<td>STEP price</td>
											<td>{`${convertNumberToText(stepPrice, 'icx')} ICX`}</td>
										</tr>
										<tr>
											<td>Actual TxFee</td>
											<td>{`${convertNumberToText(fee, 'icx')} ICX`}<em>{`${convertNumberToText(feeUsd, 'usd')} USD`}</em></td>
										</tr>
										<tr>
											<td>Data</td>
											<td className="convert">
												<div className="scroll">
													<p>{dataString}</p>
												</div>
												<button className="btn-type-normal">Convert to UTF-8</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			)
		}
	}
}

const AddressCell = ({ address }) => {
	const isAddress = isVaildData(address)
	if (isAddress) {
		const isContract = isContractAddress(address)
		let className = ''
		if (isContract) {
			className = 'trans'
		}
		return <td className={className}>{isContract && <i className="img"></i>}<span><WalletLink to={address} /></span><CopyButton data={address} title={'Copy Address'} isSpan/></td>	
	}
	else {
		return <td>-</td>
	}
}

export default withRouter(TransactionDetailPage);

import React, { Component, Fragment } from 'react'
import { numberWithCommas, convertNumberToText, getIsSolo } from 'utils/utils'

class InfoSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSolo: false,
        }
    }

    async componentDidMount() {
        const isSolo = await getIsSolo()
        this.setState({ isSolo })
    }

    render() {
        const { isSolo } = this.state
        const { tmainInfo } = this.props.info || {}
        const {
            crepCount,
            icxSupply,
            marketCap,
            transactionCount,
            icxCirculationy,
        } = tmainInfo || {}
        const marketCapStr = numberWithCommas(Math.floor(marketCap))
        return (
            <Fragment>
                <li>
                    <p>
                        Market Cap<em className="subTitle">USD</em>
                    </p>
                    <p
                        className={`num a ${marketCapStr.length >= 17 &&
                            'small'}`}
                    >
                        {marketCapStr}
                    </p>
                </li>
                <li>
                    <p className="subTitle">ICX Supply</p>
                    <p className="num b">{numberWithCommas(icxSupply)}</p>
                </li>
                <li>
                    <p className="subTitle">ICX Circulation</p>
                    <p className="num c">
                        {convertNumberToText(icxCirculationy, 0)}
                    </p>
                </li>
                <li>
                    <p>All Transactions</p>
                    <p>{numberWithCommas(transactionCount)}</p>
                    {/* {!isSolo && (
                        <p className="subTitle c">
                            C-reps<em>{numberWithCommas(crepCount)}</em>
                        </p>
                    )} */}
                    {/*<p className="subTitle c">Public Treasury<em>{numberWithCommas(publicTreasury)}</em></p>*/}
                </li>
            </Fragment>
        )
    }
}

export default InfoSummary

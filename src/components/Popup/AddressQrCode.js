import React, { Component } from 'react';
import {
    QrCodeComponent
} from '../../components'
import { sendTransaction } from '../../redux/store/iiss'

class AddressQrCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            city: "",
            contract_address: this.props.contract,
            country: "",
            discord: "",
            facebook: "",
            github: "",
            keybase: "",
            license: "",
            long_description: "",
            p_rep_address: "",
            reddit: "",
            short_description: "",
            steemit: "",
            team_name: "",
            telegram: "",
            twitter: "",
            website: "",
            wechat: "",
            youtube: "",
            zipped_source_code: ""
        }
    }

    blobToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result)
            }
        })
    }

    base64ToHex(base64Str) {
        let str = base64Str;
        let result = ''
        for (let i=0; i< str.length; i++) {
            const hex = str.charCodeAt(i).toString(16);
            result += (hex.length ===2? hex: '0' + hex)
        } return result.toUpperCase()
    }
    formData = new FormData();
    handleSubmit = (e) => {
        e.preventDefault()
        let file = document.getElementById("contractzip").files[0]
        this.formData.append(`${file.name}`, file)
        this.setState({zipped_source_code: file})
        console.log(file, "code")
        console.log(file instanceof Blob, "is a blob")
        this.blobToBase(file).then(res => {
            console.log(res, "blob to base")
            console.log(this.base64ToHex(res), "a hex<=====")


            sendTransaction(
                { fromAddress: this.props.data.address, contract: this.props.data.contract, zip: res }
            )
        })








        let textPromise = file.text()
        let newFile
        // file.text().then(text => {
        //     sendTransaction(
        //         { fromAddress: this.props.data.address, contract: this.props.data.contract, zip: text }
        //     )
        // })

        



    }

    setName = (e) => {
        this.setState({ team_name: e.target.value })
    }
    setCity = (e) => {
        this.setState({ city: e.target.value })
    }
    setCountry = (e) => {
        this.setState({ country: e.target.value })
    }
    setWebsite = (e) => {
        this.setState({ website: e.target.value })
    }
    setShortDesc = (e) => {
        this.setState({ shortDesc: e.target.value })
    }
    setLongDesc = (e) => {
        this.setState({ longDesc: e.target.value })
    }
    setGithub = (e) => {
        this.setState({ github: e.target.value })
    }
    setTwitter = (e) => {
        this.setState({ twitter: e.target.value })
    }
    setTelegram = (e) => {
        this.setState({ telegram: e.target.value })
    }
    setReddit = (e) => {
        this.setState({ reddit: e.target.value })
    }
    setYoutube = (e) => {
        this.setState({ youtube: e.target.value })
    }
    setDiscord = (e) => {
        this.setState({ discord: e.target.value })
    }
    setSteemit = (e) => {
        this.setState({ steemit: e.target.value })
    }
    setWeChat = (e) => {
        this.setState({ weChat: e.target.value })
    }
    setKeybase = (e) => {
        this.setState({ keybase: e.target.value })
    }
    setLicesne = (e) => {
        this.setState({ license: e.target.value })
    }
    setZip = async (e) => {
        let file = document.getElementById("contractzip").files[0]

        this.setState({zipped_source_code: file})
        console.log(this.formData, "code")
    }
    labels;
    componentDidMount() {
        this.labels = document.getElementsByClassName("legend")
        console.log(this.labels, "labels")
        
    }




    render() {


        const { data } = this.props
        const { address } = data

        return ([
            <>
                <h1 key='h1' className="title">Submit a Contract for Verification</h1>
                <div className="cv-form-container verify">
                    <form actionmethod="POST"onSubmit={(e) => this.handleSubmit(e)} encType="multipart/form-data" id="contractform">
                        <div className="cv-label-container">
                            <p className="cv-label">
                                Wallet: </p><input className="txt-type-search modified" type="text" name="address" readOnly={true} value={address} placeholder={address} />

                        </div>
                        <div className="cv-label-container">
                            <p className="cv-label">
                                Contract: </p><input class="txt-type-search modified" type="text" name="contract" readOnly={true} value={this.props.data.contract} placeholder={this.props.data.contract} />

                        </div>
                        {/* <section>
                            <fieldset>
                                <p>
                                </p>
                                <br />
                            </fieldset>
                        </section> */}
                        <div className="verify-form">
                            <div>
                                <section>

                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Team Name:</p>
                                        <input className="txt-type-search modified cv" autocomplete="organization" value={this.state.name} type="text" name="name" onChange={(e) => this.setName(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Short Desc:</p>
                                        <input className="txt-type-search modified cv" autocomplete="off" value={this.state.shortDesc} type="text" name="shortdesc" onChange={(e) => this.setShortDesc(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Long Desc:</p>
                                        <textarea rows="3" cols="41" className="modified cv" autocomplete="off" value={this.state.longDesc} type="textarea" name="longdesc" onChange={(e) => this.setLongDesc(e)} />
                                    </div>

                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            City:
                                        </p>
                                        <input className="txt-type-search modified" type="text" name="city" autocomplete="city" value={this.state.city} onChange={(e) => this.setCity(e)} />
                                    </div>

                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Country:
                                        </p>
                                        <input class="txt-type-search modified" type="country" name="country" autocomplete="country-name" value={this.state.country} onChange={(e) => this.setCountry(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Website:
                                        </p>
                                        <input class="txt-type-search modified" type="website" name="website" autocomplete="website" value={this.state.website} onChange={(e) => this.setWebsite(e)} />
                                    </div>


                                    {/* <div className="cv-label-container">
                        <p className="cv-label">
                        p_rep Address:
                        </p>
                        <input class="txt-type-search modified" type="text" name="prep_address" />
                        </div> */}
                                </section>
                                <div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Github: </p><input class="txt-type-search modified" type="text" name="github" value={this.state.github} onChange={(e) => this.setGithub(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Twitter:</p> <input class="txt-type-search modified" type="text" name="twitter" placeholder={"@handle"} value={this.state.twitter} onChange={(e) => this.setTwitter(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Telegram:</p><input class="txt-type-search modified" type="text" name="telegram" value={this.state.telegram} onChange={(e) => this.setTelegram(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Reddit: </p><input class="txt-type-search modified" type="text" name="reddit" value={this.state.reddit} onChange={(e) => this.setReddit(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Youtube:</p> <input class="txt-type-search modified" type="text" name="youtube" value={this.state.youtube} onChange={(e) => this.setYoutube(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Facebook:</p><input class="txt-type-search modified" type="text" name="facebook" value={this.state.facebook} onChange={(e) => this.setFacebook(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Discord:</p><input class="txt-type-search modified" type="text" name="discord" value={this.state.discord} onChange={(e) => this.setDiscord(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Steemit:</p><input class="txt-type-search modified" type="text" name="steemit" value={this.state.steemit} onChange={(e) => this.setSteemit(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            WeChat:</p><input class="txt-type-search modified" type="text" name="wechat" value={this.state.wechat} onChange={(e) => this.setWeChat(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            Keybase:</p><input class="txt-type-search modified" type="text" name="keybase" value={this.state.keybase} onChange={(e) => this.setKeybase(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            License:</p><input class="txt-type-search modified" type="text" name="keybase" value={this.state.keybase} onChange={(e) => this.setKeybase(e)} />
                                    </div>
                                    <div className="cv-label-container">
                                        <p className="cv-label">
                                            .zip File:</p><input type="file" id="contractzip" name="filename" onChange={(e) => this.setZip(e.target.value)}/>
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div className='btn-holder full'>
                            {/* <input type="file" id="myFile" name="filename"/> */}
                            <button type="submit" className='btn-type-normal size-full' >
                                <span>Sign & Submit</span>
                            </button>
                        </div>
                    </form>





                </div>

            </>
        ])
    }
}

export default AddressQrCode

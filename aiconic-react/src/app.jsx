import React from 'react';
import 'normalize.css'
import Dropzone from 'react-dropzone';
import {uploadImageAsync} from './api/classify.js';

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            files: [] ,
            results: [],
            classification: false,
            uploading: false,
            confidence: 0
        }
    }

    async onDrop(files) {
        this.setState({files, uploading: true});
        try{
            let uploadResponse = await uploadImageAsync(files);
            if(parseFloat(uploadResponse.result.diseased) > parseFloat(uploadResponse.result.notdiseased)){
                console.log("RIP");
                this.setState({ results: uploadResponse, classification: true, confidence: parseFloat(uploadResponse.result.diseased) });
            }else{
                console.log("SAFE");
                this.setState({ results: uploadResponse, classification: false, confidence: parseFloat(uploadResponse.result.notdiseased) });
            }
        }catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }

    }

    render() {
        console.log(this.state);

        let status = "";
        let statusText = "";
        let confidence = this.state.confidence;
        if(this.state.uploading === true){
            status = <i className="fas fa-cog fa-spin fa-8x"/>;
            statusText = <p>Uploading...</p>;
        }else if((this.state.results).length <= 0){
            status = <i className="fa fa-upload fa-8x"/>;
            statusText = <p>Upload or drop eye scans here.</p>;
        }else if(this.state.classification === true){
            status = <i className="disease-present far fa-times-circle fa-8x"/>
            statusText = <p>Looks like you may have diabetic retinopathy. But don't panic! Here <a target="_blank" href="http://google.com">is a list of doctors</a> in your area who specialize in this disease.</p>;
        }else{
            status = <i className="far disease-clear fa-check-circle fa-8x"/>;
            statusText = <p>Looks like you are all clear!</p>;
        }
        return (
            <div className="App" id="page-top">
                <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                    <div className="container">
                        <a className="navbar-brand js-scroll-trigger" href="#page-top">AIConic</a>
                        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                                data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                                aria-label="Toggle navigation">
                            Menu
                            <i className="fa fa-bars"></i>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <a className="nav-link js-scroll-trigger" href="#about">About</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <header className="masthead">
                    <div className="intro-body">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 mx-auto">
                                    <h1 className="brand-heading">AIC<i className="fa fa-eye" aria-hidden="true"/>nic
                                    </h1>
                                    <p className="intro-text">An instant and accurate classifier for <a target="_blank"
                                                                                                        href="https://en.wikipedia.org/wiki/Diabetic_retinopathy">Diabetic
                                        Retinopathy</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <Dropzone id="download" className="download-section content-section text-center" onDrop={this.onDrop.bind(this)}>
                    <div className="container">
                        {statusText}
                        {confidence > 0 ? confidence : ""}
                        {status}

                        <aside className="mt-5">
                            {
                                this.state.files.map(f => <p key={f.name}>{f.name} - {f.size} bytes</p>)
                            }
                        </aside>
                    </div>
                </Dropzone>

                <section id="about" className="about-section content-section text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <h2>About AICONIC</h2>
                                <p>AICONIC is a group project from the Spring 2018 Applied AI Class taught by Richard
                                    Mammone.</p>
                                <p>Group members include: Dan Mo, Ajay Simha, Raj Ray, Mahesh Hariharasubramanian, and
                                    Shreyas Sudheendra Rao</p>
                            </div>
                        </div>
                    </div>
                </section>


                <footer>
                    <div className="container text-center">
                        <p>Copyright &copy; AIConic 2018</p>
                    </div>
                </footer>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css"
                      integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg"
                      crossOrigin="anonymous"/>
            </div>
        );
    }
}

export default App;

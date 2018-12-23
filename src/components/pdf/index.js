import React, {Component} from 'react';
import './index.less'
class PDF extends Component {
  constructor(props) {
    super(props);
    // this.state = {   scale: 1.5,   current: 1 }
    this.current = 1
    this.scale = 1.5
    this.getPdf = this
      .getPdf
      .bind(this)
    this.renderPage = this
      .renderPage
      .bind(this)
    this.nextPage = this
      .nextPage
      .bind(this)
    this.prePage = this
      .prePage
      .bind(this)
    this.scaleChange = this
      .scaleChange
      .bind(this)
  }
  componentWillMount() {
    // 导入pdf.js
    document.writeln("<script src='http://mozilla.github.io/pdf.js/build/pdf.js'></script>")
  }
  componentDidMount() {
    setTimeout(this.getPdf, 1000)
    this.pageRendering = false
    this.pageNumPending = null
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.current !== nextState.current) {
      return false
    }
  }
  getPdf() {
    const {url} = this.props
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'http://mozilla.github.io/pdf.js/build/pdf.worker.js'

    this.canvas = document.getElementById(`canvas-0001`);
    this.context = this
      .canvas
      .getContext("2d");

    this.loadingTask = window
      .pdfjsLib
      .getDocument(url)

    this.renderPage(this.current)
  }
  // renderPage = (num = 1) => {   this     .loadingTask     .promise .then(pdf =>
  // {       console.log(pdf)       pdf         .getPage(num) .then(page => { let
  // pageRendering = true;           const viewport =
  // page.getViewport(this.scale);           this.canvas.height = viewport.height;
  //           this.canvas.width = viewport.width;           var renderContext = {
  //             canvasContext: this.context, viewport: viewport           }; var
  // renderTask = page.render(renderContext);           // Wait for rendering to
  // finish   renderTask             .promise             .then(() => {
  // pageRendering = false;               if (this.pageNumPending !== null) { //
  // New page rendering is pending this.renderPage(this.pageNumPending);
  // this.pageNumPending = null;               }             });     }) }) }
  renderPage() {

    this
      .loadingTask
      .promise
      .then(pdf => {
        console.log(pdf)
        var pages = pdf._pdfInfo.numPages
        var list = document.createElement('div')
        for (let i = 1; i <= pages; i++) {
          var canvas = document.createElement('canvas')
          canvas.id = `canvas${i}`
          list.appendChild(canvas)
        }
        document
          .getElementById('canvas')
          .appendChild(list)

        for (let i = 1; i <= pages; i++) {
          setTimeout(() => {
            pdf
              .getPage(i)
              .then(page => {
                let pageRendering = true;
                const canvas = document.getElementById(`canvas${i}`)
                const viewport = page.getViewport(this.scale);
                console.log(viewport)
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const context = document
                  .getElementById(`canvas${i}`)
                  .getContext("2d");

                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                var renderTask = page.render(renderContext);
                // Wait for rendering to finish
                renderTask
                  .promise
                  .then(() => {
                    pageRendering = false;
                    if (this.pageNumPending !== null) {
                      // New page rendering is pending
                      this.renderPage(this.pageNumPending);
                      this.pageNumPending = null;
                    }
                  });
              })
          })
        }
      })
  }
  // 下一页
  nextPage() {

    this.current = this.current + 1
    if (this.pageRendering) {
      this.pageNumPending = this.current
    } else {
      this.renderPage(this.current)
    }
  }
  // 上一页
  prePage() {
    this.current = this.current - 1
    if (this.pageRendering) {
      this.pageNumPending = this.current
    } else {
      this.renderPage(this.current)
    }

  }
  // 缩小
  scaleChange() {
    this.scale = this.scale - 0.1
    this.renderPage(this.current)
  }
  render() {
    return (
      <div id='canvas'>
        <button onClick={this.nextPage}>下一页</button>
        <button disabled={this.current <= 1} onClick={this.prePage}>上一页</button>
        <button onClick={this.scaleChange}>缩小</button>
        <canvas id={`canvas-0001`}/>
      </div>
    );
  }
}

export default PDF;
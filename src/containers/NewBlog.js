import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewBlog.css";
import { invokeApig, s3Upload, s3UploadBlogImage, s3UploadBlogJpegBlob } from "../libs/awsLib";
import readAndCompressImage from 'browser-image-resizer';

export default class NewBlog extends Component {
  constructor(props) {
    super(props);

    this.files = null;

    this.state = {
      isLoading: null,
      title: "",
      subtitle: "",
      content: ""
    };
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.files = Array.from(event.target.files);
    //this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      //const uploadedFilename = this.file
      //  ? (await s3Upload(this.file)).Location : null;

      var fileNames = [];
      for (var file of this.files) {
        const uploadedFilename = file
          ? (await s3UploadBlogImage(file, "lg")).Location : null;
          fileNames.push(uploadedFilename);

        //const smallImage = await this.resizeImage(file, config.smImageConfig);
        //smallImage.name = file.name;
        //smallImage.type = file.type;
        //smallImage.lastModifiedDate = new Date();

        const resizedFile = await readAndCompressImage(file, config.smImageConfig).then(resizedImage =>{
          return new File([resizedImage], file.name, {type: "image/jpeg", lastModified: Date.now()});
        });

        const smallFilename = resizedFile ? (await s3UploadBlogImage(resizedFile, "sm")).Location : null;

      }

      const blog = await this.createBlog({
        title: this.state.title,
        subtitle: this.state.subtitle,
        content: this.state.content
      });

      if (blog !== null) {
        for (var fileUrl of fileNames) {
          await this.addImage({
            blogId: blog.blogId,
            image: fileUrl
          })
        }
      }

      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  async resizeImage(file, imageConfig) {
    readAndCompressImage(file, imageConfig).then(resizedImage =>{
    console.log(resizedImage);
    var resizedFile = new File([resizedImage], file.name, {type: "image/jpeg", lastModified: Date.now()});
    console.log(resizedFile);
    return resizedFile;
  });
  }

  createBlog(blog) {
    return invokeApig({
      path: "/blogs",
      method: "POST",
      body: blog
    });
  }

  addImage(image) {
    return invokeApig({
      path: "/images",
      method: "POST",
      body: image
    });
  }

/*
  category: data.category,
        city: data.city,
        state: data.state,
        country: data.country,
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        latitude: data.latitude,
        longitude: data.longitude
        */
  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>

          <FormGroup controlId="title">
            <FormControl
              onChange={this.handleChange}
              value={this.state.title}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="subtitle">
            <FormControl
              onChange={this.handleChange}
              value={this.state.subtitle}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>

          <FormGroup controlId="file">
            <ControlLabel>{config.MAX_ATTACHMENT_SIZE}</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" multiple />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}

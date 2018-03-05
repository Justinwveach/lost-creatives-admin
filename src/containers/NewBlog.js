import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import ImageSize from "../enums/ImageSize";
import ImageSet from "../models/ImageSet";
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

      var imageSets = [];
      for (var file of this.files) {
        //const uploadedFilename = file
        //  ? (await s3UploadBlogImage(file, "lg")).Location : null;
        //  fileNames.push(uploadedFilename);

        //const smallImage = await this.resizeImage(file, config.smImageConfig);
        //smallImage.name = file.name;
        //smallImage.type = file.type;
        //smallImage.lastModifiedDate = new Date();

        const smallImage = await readAndCompressImage(file, config.smImageConfig).then(resizedImage =>{
          return this.blobToFile(resizedImage, file.name);
        });
        const mediumImage = await readAndCompressImage(file, config.mdImageConfig).then(resizedImage =>{
          return this.blobToFile(resizedImage, file.name);
        });
        const largeImage = await readAndCompressImage(file, config.lgImageConfig).then(resizedImage =>{
          return this.blobToFile(resizedImage, file.name);
        });

        const smallFileLink = smallImage ? (await s3UploadBlogImage(smallImage, ImageSize.SMALL)).Location : null;
        const mediumFileLink = mediumImage ? (await s3UploadBlogImage(mediumImage, ImageSize.MEDIUM)).Location : null;
        const largeFileLink = smallImage ? (await s3UploadBlogImage(largeImage, ImageSize.LARGE)).Location : null;

        const imageSet = new ImageSet(smallFileLink, mediumFileLink, largeFileLink);
        imageSets.push(imageSet);
      }

      // Add a blog entry
      const blog = await this.createBlog({
        title: this.state.title,
        subtitle: this.state.subtitle,
        content: this.state.content
      });

      // After we have uploaded the blog, add an image entry that maps the images to the blog
      if (blog !== null) {
        for (var imageSet of imageSets) {
          await this.addImage({
            blogId: blog.blogId,
            smallImage: imageSet.small,
            mediumImage: imageSet.medium,
            largeImage: imageSet.large
          })
        }
      }

      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  blobToFile(blob, name) {
    return new File([blob], name, {type: "image/jpeg", lastModified: Date.now()});
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
            <FormControl onChange={this.handleFileChange} type="file" multiple accept="image/*" />
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

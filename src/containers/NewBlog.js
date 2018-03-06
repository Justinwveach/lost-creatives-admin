import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import ImageSize from "../enums/ImageSize";
import ImageSet from "../models/ImageSet";
import "./NewBlog.css";
import { invokeApig, s3Upload, s3UploadBlogImage, s3UploadBlogJpegBlob } from "../libs/awsLib";
import readAndCompressImage from "browser-image-resizer";
import CategoryDropdown from "../components/CategoryDropdown";

export default class NewBlog extends Component {
  constructor(props) {
    super(props);

    this.files = null;

    this.state = {
      isLoading: null,
      title: "",
      subtitle: "",
      content: "",
      category: "",
      city: "",
      state: "",
      country: "",
      latitude: "",
      longitude: ""
    };
  }

  validateForm() {
    return this.state.content.length > 0 &&
           this.state.title.length > 0 &&
           this.state.subtitle.length > 0 &&
           this.state.city.length > 0 &&
           this.state.state.length > 0 &&
           this.state.country.length > 0 &&
           this.state.latitude.length > 0 &&
           this.state.longitude.length > 0 &&
           this.state.category.length > 0;
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
      const date = Date.now();

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

        const smallFileLink = smallImage ? (await s3UploadBlogImage(smallImage, ImageSize.SMALL, date)).Location : null;
        const mediumFileLink = mediumImage ? (await s3UploadBlogImage(mediumImage, ImageSize.MEDIUM, date)).Location : null;
        const largeFileLink = smallImage ? (await s3UploadBlogImage(largeImage, ImageSize.LARGE, date)).Location : null;

        const imageSet = new ImageSet(smallFileLink, mediumFileLink, largeFileLink);
        imageSets.push(imageSet);
      }

      // Add a blog entry
      const blog = await this.createBlog({
        title: this.state.title,
        subtitle: this.state.subtitle,
        content: this.state.content,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        category: this.state.category
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
            <ControlLabel>Title</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.title}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="subtitle">
            <ControlLabel>Subtitle</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.subtitle}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="city">
            <ControlLabel>City</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.city}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="state">
            <ControlLabel>State</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.state}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="country">
            <ControlLabel>Country</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.country}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="latitude">
            <ControlLabel>Latitude</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.latitude}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="longitude">
            <ControlLabel>Longitude</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.longitude}
              componentClass="input"
            />
          </FormGroup>

          <CategoryDropdown
            onChange={this.handleChange}
            value={this.state.category}
            controlId="category"
            label="Category"/>

          <FormGroup controlId="content">
            <ControlLabel>Blog Content</ControlLabel>
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

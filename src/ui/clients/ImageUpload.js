import React, {useEffect, useReducer, useState} from 'react';
import {Dialog} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import ImageViewer from "react-simple-image-viewer";
import {addClient, addImageToClient, delImageFromClient} from "../../services/services";
import axios from "axios";

function ImageUpload(props) {

    const {open,setOpen,images_data,company} = props;
    const [image,setImage] = useState(images_data!=null?images_data[0]:null);
    const [currentImage,setCurrentImage] = useState(0)
    const [images,setImages] = useState([]);
    const [imageViewer,setImageViewer] = useState(false);

    useEffect(()=> {
        console.log('images_data : ')
        console.log(images_data)
        images_data!=null?setImages([...images_data]):setImages([]);
    },[images_data])

    const closeImageViewer = () => {
        setCurrentImage(0);
        setOpen(false);
    };

    const onFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleImageSubmit = (e,image)=>{
        e.preventDefault()
        console.log('images : ')
        console.log(images_data)
        console.log(images)
        if(images!=null && images.length==5) {
            alert('You cant enter more then 5 images')
            return
        }
        if(image==undefined) {
            alert('Please select an image')
            return
        }
        console.log(company)
        const formData = new FormData()
        formData.append('image', image)
        formData.append('client',company.name )
        axios.post(`http://localhost:4000/${company.name}`, formData, {
        }).then(async res => {
            images?setImages([...images,res.data]):setImages([res.data]);
            (await addImageToClient(company,res.data));
        })
    }

    async function handleImageDelete(e, imageToDel, index) {
        setImages(images.filter((image) => image != imageToDel))
        let imageName = imageToDel.split('/');
        console.log('imageName : ', imageName)
        console.log(imageToDel)
        axios.delete(`http://localhost:4000/${imageName[imageName.length - 1]}/${company.name}`, {

        }).then(async res => {
            console.log(res)
            await delImageFromClient(company,imageToDel)
        })
    }

    return (
        <>
        <Dialog
            fullScreen
            sx={{zIndex:10}}
            open={open}
            onClose={()=>setOpen(false)}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar sx={{backgroundColor:'#52b387'}}>
                    <IconButton
                        edge="start"
                        color="red"
                        onClick={()=>setOpen(false)}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Documents
                    </Typography>
                    <div className="mt-2">
                        <input type="file" onChange={onFileChange} />
                        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={(e)=>handleImageSubmit(e,image)}>Add Image</button>
                    </div>
                </Toolbar>
            </AppBar>
            <div className="min-w-fit">
                {images!=null?<div  className="grid grid-cols-2 justify-evenly gap-10 mt-5 border-2">
                    {images.map((image,index)=> <div><img
                        src={image}
                        alt={image}
                        width='90%'
                        loading="lazy"
                        style={{cursor:'pointer', display:'inline', margin:10}}
                        onClick={()=> {
                            setImageViewer(index)
                            setOpen(false)
                        }}

                    />
                        {<button className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800" onClick={(e)=>handleImageDelete(e,image,index)}>Delete</button>}
                    </div>)}
                </div>:<></>}
            </div>
        </Dialog>
        {imageViewer && (
            <ImageViewer
                src={images}
                currentIndex={currentImage}
                onClose={closeImageViewer}
                style={{zIndex:100}}
                disableScroll={false}
                backgroundStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)"
                }}
                closeOnClickOutside={true}
            />
        )}
        </>
    );

}

export default ImageUpload;
"use client"

import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, QueryDocumentSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"



type dog = {
    name: string;
    breed: string;
    age: number;
    id?: string;
    image?: string;
    gender?: string;
    weight?: number;
    description?: string;

}

const page = () => {
    const [dogs, setDogs] = useState<dog[]>([]);
    const [newDog, setNewDog] = useState<dog>({ name: '', breed: '', age: 0, weight: 0, description: ''});
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const addDog = async (e: any) => {
        e.preventDefault();

        if (newDog.name === '' || newDog.breed === '' || newDog.age === 0 || !selectedImage) {
            alert('Please fill in all fields and select an image.');
            return;
        }

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `images/${newDog.name}`);

            // Upload the file
            const uploadTask = uploadBytesResumable(storageRef, selectedImage);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // This can be used to show upload progress to the user
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.error("Upload error:", error);
                },
                async () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);

                    // Add the new dog data to Firestore
                    try {
                        const docRef = await addDoc(collection(db, "dogs"), {
                            ...newDog,
                            weight: newDog.weight, // Include weight
                            image: downloadURL, // Include image URL
                            description: newDog.description // Include description
                        });

                        console.log("Document written with ID: ", docRef.id);

                        // Reset the state and clear the image selection
                        setNewDog({ name: '', breed: '', age: 0, weight: undefined, description: '' });
                        setSelectedImage(null);
                    } catch (error) {
                        console.error("Error adding document: ", error);
                    }
                }
            );
        } catch (error) {
            console.error("Error uploading image: ", error);
            // Handle errors appropriately, e.g., display an error message to the user
        }
    };


    useEffect(() => {
        const q = query(collection(db, "dogs"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let dogsArray: dog[] = [];
            querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
                const { name, breed, age, ...otherData } = doc.data(); // Destructure specific properties
                dogsArray.push({
                  name, // Assign destructured values directly
                  breed,
                  age,
                  id: doc.id, // Add id property explicitly
                  ...otherData, // Spread remaining data if needed
                });
              });
            setDogs(dogsArray);
        });
    }, []);

    return (
        <>
            <h1 className='text-lg text-center'>Add dog for adoption</h1>



            <div className="bg-white shadow container border border-red-500 items-center justify-center w-4/6 mx-auto my-8 flex flex-col px-10 py-5 gap-4 rounded-lg">
  <div className='flex flex-wrap justify-center gap-6'>
    <div className='w-full md:w-1/2'>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
      <input className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' onChange={(e) => setNewDog({ ...newDog, name: e.target.value })} type="text" name="name" value={newDog.name} placeholder="Name" />
    </div>
    <div className='w-full md:w-1/2'>
      <label htmlFor="breed" className="block text-sm font-medium text-gray-700">Breed</label>
      <input className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' onChange={(e) => setNewDog({ ...newDog, breed: e.target.value })} type="text" name="breed" value={newDog.breed} placeholder="Breed" />
    </div>
  </div>
  <div>
    <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
    <input min="1" step="1" className='mt-1 block w-full md:w-1/4 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500' type="number" name="age" onChange={(e) => setNewDog({ ...newDog, age: parseInt(e.target.value) })} value={newDog.age} placeholder="Age" />
  </div>
<div>
    <label htmlFor="age" className="block text-sm font-medium text-gray-700">weight</label>
    <input
        min="1"
        step="1"
        className='mt-1 block w-full md:w-1/4 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        type="number"
        name="weight"
        onChange={(e) => setNewDog({ ...newDog, weight: e.target.value ? parseInt(e.target.value) : undefined })} // Handle empty string and convert to undefined
        value={newDog.weight}
        placeholder="0"
    />
</div>
<div className='w-full md:w-1/4 mx-auto'>
    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
    <input type="file" name="image" onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700" />
</div>
  <div className='w-full md:w-1/4 mx-auto'>
    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
    <textarea id="description" name="description" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter description here..."></textarea>
  </div>
  <button onClick={addDog} className="mt-2 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-indigo-500/50 transition duration-150 ease-in-out">Submit</button>
</div>



            <div className="container grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
            {dogs.map(dog => (
    <Card key={dog.name} className="dog-card">
    <CardHeader>
      <CardTitle>{dog.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <img src={dog.image} alt={dog.name} />
    </CardContent>
    <CardFooter>
      <CardDescription>{dog.breed}</CardDescription>
    </CardFooter>
  </Card>
))}
            </div>
        </>
    );
}

export default page;

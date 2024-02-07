import { doc, setDoc } from "firebase/firestore";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

type Dog = {
    name: string;
    breed: string;
    age: number;
    gender: string;
    weight: number;
    image: string;
};

async function getDogs() {
    try {
        const res = await fetch('http://localhost:4000/dogs');
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch dogs:", error);
        return []; // Return an empty array as a fallback
    }
}


const DogList = async () => {
    const dogs: Dog[] = await getDogs(); // Use the type here if using TypeScript
    console.log(dogs);
    return (
        <>

<div className="container grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
  {dogs.map((dog) => (
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

export default DogList;

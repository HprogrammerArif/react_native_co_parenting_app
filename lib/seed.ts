import { ID } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
        )
    );
}

// Commented out - not needed when using external image URLs
// If you want to upload images to Appwrite storage in the future, you'll need to:
// 1. Download images to local storage first
// 2. Use react-native-fs or expo-file-system to handle file operations
// 3. Pass the local file URI to storage.createFile()

// async function clearStorage(): Promise<void> {
//     const list = await storage.listFiles(appwriteConfig.bucketId);
//     await Promise.all(
//         list.files.map((file) =>
//             storage.deleteFile(appwriteConfig.bucketId, file.$id)
//         )
//     );
// }

// async function uploadImageToStorage(imageUrl: string) {
//     // Note: This doesn't work in React Native due to blob/fetch limitations
//     // Use expo-file-system or react-native-fs for proper file handling
// }

async function seed(): Promise<void> {
    try {
        console.log("🌱 Starting seed process...");
        
        // 1. Clear all
        console.log("🧹 Clearing categories...");
        await clearAll(appwriteConfig.categoriesCollectionId);
        
        console.log("🧹 Clearing customizations...");
        await clearAll(appwriteConfig.customizationsCollectionId);
        
        console.log("🧹 Clearing menu...");
        await clearAll(appwriteConfig.menuCollectionId);
        
        console.log("🧹 Clearing menu_customizations...");
        await clearAll(appwriteConfig.menuCustomizationsCollectionId);
        
        // Storage clearing skipped - using external image URLs

        // 2. Create Categories
        console.log("📁 Creating categories...");
        const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }

        // 3. Create Customizations
        console.log("🔧 Creating customizations...");
        const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.customizationsCollectionId,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }

        // 4. Create Menu Items
        console.log("🍔 Creating menu items...");
        const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        // Use the image URL directly instead of uploading to storage
        console.log(`📝 Creating menu item: ${item.name}`);

        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: item.image_url, // Use external URL directly
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );

        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.menuCustomizationsCollectionId,
                ID.unique(),
                {
                    menu: doc.$id,
                    customizations: customizationMap[cusName],
                }
            );
        }
    }

        console.log("✅ Seeding complete.");
    } catch (error) {
        console.error("❌ Seed error:", error);
        throw error;
    }
}

export default seed;

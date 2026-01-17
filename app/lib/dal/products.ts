import { NextResponse } from "next/server";
import { pool } from "../db";
import { randomUUID } from "crypto";

interface CreateProductData{
    name: string;
    description: string;
    weight: string;
    product_code: string;
    category_id: string;
    images: string[];
}

export async function getAllProducts() {
    const { rows } = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.product_code,
        p.weight, 
        p.is_active,
        p.is_sold_out,
        p.is_featured,
        c.name as category_id,
        (
          SELECT image_url FROM product_images 
          WHERE product_id = p.id 
          ORDER BY position ASC 
          LIMIT 1
        ) as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    return rows;
    
}

export async function getProductById(id: string) {
    const productQuery =`
        SELECT 
        p.id, p.name, p.description, p.weight, p.product_code, 
        p.category_id, p.is_active, p.is_sold_out, p.is_featured,
        c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
    `;
    const productRes = await pool.query(productQuery, [id]);

    if(productRes.rows.length === 0) return null;
    const product = productRes.rows[0];


    const imagesQuery = `
        SELECT id,image_url, position
        FROM product_images
        WHERE product_id = $1
        ORDER BY position ASC
    `;

    const imagesRes = await pool.query(imagesQuery, [id]);

    return {
        ...product,
        images: imagesRes.rows
    };
}

export async function createProduct(data: CreateProductData){
    const { name, description, weight, product_code, category_id, images } = data;

    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        const productId = randomUUID();

        await client.query(
            `INSERT INTO products (
            id, name, description, weight, product_code, category_id, is_active, is_sold_out, updated_at) VALUES ($1, $2, $3, $4, $5, $6, true, false, NOW())`,
            [productId, name, description, weight, product_code, category_id]
        );

        if(images && images.length > 0){
            for(  let i = 0; i < images.length; i++){
                const imageId = randomUUID();
                await client.query(
                    `INSERT INTO product_images (id, product_id, image_url, position)
                    VALUES($1,$2,$3,$4, NOW())`,
                    [imageId, productId, images[i], i]
                );
            }
        }
        await client.query('COMMIT');
        return productId;
    }
    catch(error){
        await client.query('ROLLBACK');
        throw error;
    }
    finally{
        client.release();
    }
}

export async function updateProduct(id: string, data: Partial<CreateProductData>){
    const {name, description, weight, product_code, category_id } = data;

    const query = `
        UPDATE products
        SET 
            name = $1,
            description = $2,
            weigth = $3,
            product_code = $4,
            category_id = $5,
            updated_at = NOW()
        WHERE id = $6
    `;
    await pool.query(query,[name,description,weight,product_code,category_id,id]);
}

export async function deleteProduct(id: string){
    const client = await pool.connect();
    try{
        await client.query("BEGIN");

        //Delete the Images of Product
        await client.query(`DELETE FROM product_images WHERE product_id = $1`, [id]);

        //Delete the Product Details and overall product
        await client.query(`DELETE FROM products WHERE id = $1`, [id]);

        await client.query("COMMIT");
    }
    catch(error){
        await client.query("ROLLBACK");
        throw error;
    }
    finally{
        client.release();
    }
}

export async function toggleProductStock(id: string, isSoldOut: boolean){
    const query = `
        UPDATE products
        SET is_sold_out = $1, updated_at = NOW()
        WHERE id = $2
    `;
    await pool.query(query,[isSoldOut, id]);
}

export async function toggleProductFeatured(id: string, status: boolean){
    const query=`
        UPDATE products
        SET is_featured = $1, updated_at = NOW()
        WHERE id = $2
    `;
    await pool.query(query, [status, id]);
}

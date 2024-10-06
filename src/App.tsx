import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import FeaturedProducts from './components/FeaturedProducts'
import ProductManagement from './components/ProductManagement'
import UserManagement from './components/UserManagement'
import FeatureManagement from './components/FeatureManagement'
import Footer from './components/Footer'
import AddCategory from './components/AddCategory'
import FavoriteProducts from './components/FavoriteProducts'
import Login from './components/Login'
import Register from './components/Register'

// Define types
type Product = {
  id: number
  name: string
  price: number
  category: string
  subCategory: string
  sku: string
  description: string
  image: string
  disabled: boolean
}

type User = {
  id: number
  username: string
  email: string
  role: 'admin' | 'manager' | 'user'
}

type Feature = {
  id: number
  name: string
  description: string
  permissions: {
    admin: boolean
    manager: boolean
    user: boolean
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categorySubCategories, setCategorySubCategories] = useState<Record<string, string[]>>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }

    // Load dummy data
    setProducts([
      {
        id: 1,
        name: "Diamond Ring",
        price: 1999.99,
        category: "Rings",
        subCategory: "Diamond",
        sku: "DR001",
        description: "Beautiful diamond ring",
        image: "https://example.com/diamond-ring.jpg",
        disabled: false
      },
      // Add more dummy products here
    ]);

    setCategories(["Rings", "Necklaces", "Earrings"]);
    setCategorySubCategories({
      "Rings": ["Diamond", "Gold", "Silver"],
      "Necklaces": ["Pendant", "Chain"],
      "Earrings": ["Stud", "Hoop"]
    });

    setUsers([
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "admin"
      },
      // Add more dummy users here
    ]);

    setFeatures([
      {
        id: 1,
        name: "Product Management",
        description: "Manage products in the store",
        permissions: {
          admin: true,
          manager: true,
          user: false
        }
      },
      // Add more dummy features here
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prevFavorites => 
      prevFavorites.includes(productId)
        ? prevFavorites.filter(id => id !== productId)
        : [...prevFavorites, productId]
    );
  };

  const handleAddProduct = (product: Omit<Product, 'id' | 'disabled'>) => {
    const newProduct = {
      ...product,
      id: products.length + 1,
      disabled: false
    };
    setProducts([...products, newProduct]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleToggleProductStatus = (productId: number) => {
    setProducts(products.map(p => p.id === productId ? {...p, disabled: !p.disabled} : p));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
      setCategorySubCategories({...categorySubCategories, [category]: []});
    }
  };

  const handleAddSubCategory = (category: string, subCategory: string) => {
    if (categorySubCategories[category] && !categorySubCategories[category].includes(subCategory)) {
      setCategorySubCategories({
        ...categorySubCategories,
        [category]: [...categorySubCategories[category], subCategory]
      });
    }
  };

  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: users.length + 1
    };
    setUsers([...users, newUser]);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleUpdateFeature = (updatedFeature: Feature) => {
    setFeatures(features.map(f => f.id === updatedFeature.id ? updatedFeature : f));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <FeaturedProducts
                  products={products.filter(p => !p.disabled)}
                  categories={categories}
                  categorySubCategories={categorySubCategories}
                  favorites={favorites}
                  toggleFavorite={handleToggleFavorite}
                />
              </>
            } />
            <Route path="/product-management" element={
              isAuthenticated ? (
                <ProductManagement
                  products={products}
                  categories={categories}
                  categorySubCategories={categorySubCategories}
                  onAddProduct={handleAddProduct}
                  onEditProduct={handleEditProduct}
                  onToggleProductStatus={handleToggleProductStatus}
                  onAddSubCategory={handleAddSubCategory}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/add-category" element={
              isAuthenticated ? (
                <AddCategory
                  categories={categories}
                  onAddCategory={handleAddCategory}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/favorites" element={
              isAuthenticated ? (
                <FavoriteProducts
                  products={products.filter(p => !p.disabled)}
                  favorites={favorites}
                  toggleFavorite={handleToggleFavorite}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/user-management" element={
              isAuthenticated ? (
                <UserManagement
                  users={users}
                  onAddUser={handleAddUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/feature-management" element={
              isAuthenticated ? (
                <FeatureManagement
                  features={features}
                  onUpdateFeature={handleUpdateFeature}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App
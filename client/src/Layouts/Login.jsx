import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../App.css';

const Home = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.email === "venkatthondamalla@gmail.com" && formData.password === "venkat@123") {
            navigate('/home', { state: { formData } });
        } else {
            toast.error(
                'Invalid credentials',
                {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '18px',
                        padding: '16px',
                        maxWidth: '800px',
                        width: '100%',
                    }
                }
            );
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.heading}>Login</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        color: '#fff',
        padding: '0 2rem',
        position: 'relative',
        width: '100%',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.9)', // Semi-transparent form background
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        zIndex: 1,
        animation: 'slideInUp 1s ease-out', // Adding animation to the form
    },
    heading: {
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#333',
    },
    input: {
        padding: '0.8rem',
        marginBottom: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        fontSize: '1rem',
    },
    button: {
        padding: '0.8rem',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    }
};

export default Home;

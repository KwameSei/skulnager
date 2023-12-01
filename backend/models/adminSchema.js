import mongoose from 'mongoose';

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: [emailRegex, 'Please enter a valid email address'],
    required: [true, 'Email is required'],
    unique: true,
  },
  phone: {
    type: String,
    match: [phoneRegex, 'Please enter a valid phone number'],
    required: [true, 'Phone number is required'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    public_id: String,
  },
  image_mimetype: String,
  role: {
    type: String,
    default: 'Admin',
  },
  schoolName: {
    type: String,
    unique: true,
    default: '',
    required: true,
  },
},
{
  timestamps: true,
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
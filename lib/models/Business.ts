import mongoose from 'mongoose'

const businessSchema = new mongoose.Schema({
  businessOwnerName: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    required: true,
    unique: true
  },
  businessDescription: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  businessCategory: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    default: ''
  },
  businessTags: {
    type: [String],
    default: []
  },
  businessHours: {
    type: {
      monday: { open: String, close: String, closed: { type: Boolean, default: false } },
      tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
      friday: { open: String, close: String, closed: { type: Boolean, default: false } },
      saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
      sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
    },
    default: null
  },
  website: {
    type: String,
    default: null
  },
  socialHandles: {
    type: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String
    },
    default: {}
  },
  businessImages: {
    type: [String],
    default: []
  },
  ownerId: {
    type: String, // Clerk user ID
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  verificationDate: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for location-based queries
businessSchema.index({ 'location.latitude': 1, 'location.longitude': 1 })
businessSchema.index({ businessCategory: 1 })
businessSchema.index({ businessTags: 1 })
businessSchema.index({ ownerId: 1 })

export const Business = mongoose.models.Business || mongoose.model('Business', businessSchema)
const Banner = require('../models/Banner');

// Get active banners by position
const getBannersByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const currentDate = new Date();
    
    const banners = await Banner.find({
      position,
      active: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: currentDate } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: currentDate } }
      ]
    }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({ banners });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all banners (admin only)
const getAllBanners = async (req, res) => {
  try {
    const { position, active } = req.query;
    let query = {};
    
    if (position) query.position = position;
    if (active !== undefined) query.active = active === 'true';
    
    const banners = await Banner.find(query).sort({ position: 1, order: 1, createdAt: -1 });
    res.status(200).json({ banners });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single banner by ID
const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new banner (admin only)
const createBanner = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      linkUrl,
      linkText,
      backgroundColor,
      textColor,
      buttonColor,
      position,
      active,
      order,
      startDate,
      endDate
    } = req.body;

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      if (process.env.USE_LOCAL_STORAGE === 'true') {
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      } else {
        imageUrl = req.file.path; // Cloudinary URL
      }
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl; // Direct URL provided
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    const banner = await Banner.create({
      title,
      subtitle,
      description,
      imageUrl,
      linkUrl,
      linkText: linkText || 'Learn More',
      backgroundColor: backgroundColor || '#f8fafc',
      textColor: textColor || '#1f2937',
      buttonColor: buttonColor || '#3b82f6',
      position,
      active: active !== undefined ? active : true,
      order: order || 0,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update banner (admin only)
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      linkUrl,
      linkText,
      backgroundColor,
      textColor,
      buttonColor,
      position,
      active,
      order,
      startDate,
      endDate
    } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Handle image upload if provided
    let imageUrl = banner.imageUrl;
    if (req.file) {
      if (process.env.USE_LOCAL_STORAGE === 'true') {
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      } else {
        imageUrl = req.file.path; // Cloudinary URL
      }
    } else if (req.body.imageUrl && req.body.imageUrl !== banner.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    // Update fields
    banner.title = title || banner.title;
    banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
    banner.description = description !== undefined ? description : banner.description;
    banner.imageUrl = imageUrl;
    banner.linkUrl = linkUrl !== undefined ? linkUrl : banner.linkUrl;
    banner.linkText = linkText || banner.linkText;
    banner.backgroundColor = backgroundColor || banner.backgroundColor;
    banner.textColor = textColor || banner.textColor;
    banner.buttonColor = buttonColor || banner.buttonColor;
    banner.position = position || banner.position;
    banner.active = active !== undefined ? active : banner.active;
    banner.order = order !== undefined ? order : banner.order;
    banner.startDate = startDate ? new Date(startDate) : banner.startDate;
    banner.endDate = endDate ? new Date(endDate) : banner.endDate;

    const updatedBanner = await banner.save();
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete banner (admin only)
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    await banner.deleteOne();
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle banner active status (admin only)
const toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    banner.active = active;
    await banner.save();
    
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBannersByPosition,
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus
};

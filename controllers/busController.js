const User = require('../models/userModel');

/**
 * @desc Update live location of a bus
 * @route POST /api/bus/update-location
 * @access Private (Staff/Bus only)
 */
module.exports.updateLocation = async (req, res) => {
    try {
        const { x, y } = req.body;

        // 1. Basic Validation
        if (x === undefined || y === undefined) {
            return res.status(400).json({ 
                success: false, 
                error: "Latitude (x) and Longitude (y) are required" 
            });
        }

        // 2. Update Database using .findByIdAndUpdate for efficiency
        // We use req.user._id which is populated by authMiddleware
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                'location.x': x,
                'location.y': y,
                'location.lastUpdated': new Date()
            },
            { new: true, runValidators: true }
        ).select('fullname branch location');

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // 3. Emit Real-time Event via Socket.IO
        const io = req.app.get('io');
        if (io) {
            // Extract bus ID from fullname (e.g. "Bus B-11" -> "B-11")
            const busId = updatedUser.fullname.includes('Bus ') 
                ? updatedUser.fullname.split('Bus ')[1] 
                : updatedUser.fullname;

            io.emit('bus-location-updated', {
                busId: busId,
                lat: updatedUser.location.x,
                lng: updatedUser.location.y,
                updatedAt: updatedUser.location.lastUpdated
            });
        }

        res.status(200).json({
            success: true,
            message: "Location updated and broadcasted",
            data: {
                busId: updatedUser.branch,
                lat: updatedUser.location.x,
                lng: updatedUser.location.y,
                updatedAt: updatedUser.location.lastUpdated
            }
        });

    } catch (err) {
        console.error(`Update Location Error: ${err.message}`);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

/**
 * @desc Get all bus locations
 * @route GET /api/bus/all
 * @access Public/Private
 */
module.exports.getAllBusLocations = async (req, res) => {
    try {
        // Find all staff users who belong to the 'bus' branch
        const buses = await User.find({ 
            role: 'staff', 
            branch: 'bus' 
        })
        .select('branch location fullname')
        .lean();

        const formattedBuses = buses.map(bus => ({
            // Extract bus ID from fullname (e.g., "Bus B-11" -> "B-11")
            busId: bus.fullname.includes('Bus ') ? bus.fullname.split('Bus ')[1] : bus.fullname,
            lat: bus.location?.x || 0,
            lng: bus.location?.y || 0,
            updatedAt: bus.location?.lastUpdated,
            driverName: bus.fullname
        }));

        res.status(200).json({
            success: true,
            count: formattedBuses.length,
            data: formattedBuses
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

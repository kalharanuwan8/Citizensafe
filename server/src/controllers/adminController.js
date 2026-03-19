import * as adminService from '../services/adminService.js';
import * as disasterService from '../services/disasterService.js';
import * as alertService from '../services/alertService.js';

export const getDisasters = async (req, res) => {
    try {
        const disasters = await disasterService.getAllDisasters();
        return res.status(200).json({ success: true, data: disasters });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const verifyDisaster = async (req, res) => {
    try {
        const { id } = req.params;
        const disaster = await adminService.verifyDisaster(id);
        return res.status(200).json({ success: true, data: disaster });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createAlert = async (req, res) => {
    try {
        const { title, message, location, severity, expiresAt } = req.body;
        const alert = await alertService.createAlert({
            title,
            message,
            location: location || { type: "Point", coordinates: [79.8612, 6.9271] }, // Default Colombo
            severity,
            createdBy: req.user.id,
            status: "Active",
            expiresAt
        });

        // Push notification via Socket.IO
        const io = req.app.get("io");
        if (io) {
            io.emit("new-alert", alert);
        }

        return res.status(201).json({ success: true, data: alert });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

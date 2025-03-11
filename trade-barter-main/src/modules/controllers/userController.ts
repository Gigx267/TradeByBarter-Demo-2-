import { RegularMiddlewareFunction } from "../types/types";


 const getUser : RegularMiddlewareFunction = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: req.user,
            },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export {getUser}
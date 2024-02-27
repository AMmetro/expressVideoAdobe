import {WithId} from 'mongodb'
import { SecurityDevicesDB } from '../db/devices-db'
import { OutputDevicesType } from '../output/devices.output'

export const devicesMapper = (device:WithId<SecurityDevicesDB>):OutputDevicesType => {
    return {
        deviceId: device.deviceId,
        userId: device.userId,
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate,
    }
}



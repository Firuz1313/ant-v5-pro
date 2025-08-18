import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tv,
  Cpu,
  Wifi,
  HardDrive,
  ArrowRight,
  Star,
  Users,
  CheckCircle,
} from "lucide-react";

const devices = [
  {
    id: "openbox",
    name: "OpenBox",
    model: "S4 Pro+",
    image: "/placeholder.svg",
    description: "Professional-grade receiver with advanced features",
    price: "Popular Choice",
    features: [
      "4K Ultra HD Support",
      "Dual Boot Android/Linux",
      "Built-in WiFi",
      "USB Recording",
      "HDMI 2.0",
    ],
    specs: {
      cpu: "ARM Cortex-A53 Quad Core",
      ram: "1GB DDR3",
      storage: "8GB eMMC",
      wifi: "802.11 b/g/n",
    },
    rating: 4.8,
    users: "2.3M+",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "openbox-gold",
    name: "OpenBox Gold",
    model: "A7 Plus",
    image: "/placeholder.svg",
    description: "Premium model with enhanced performance",
    price: "Premium",
    features: [
      "4K/8K Ready",
      "Advanced EPG",
      "Multi-stream Support",
      "Cloud Recording",
      "Voice Control",
    ],
    specs: {
      cpu: "ARM Cortex-A73 Quad Core",
      ram: "2GB DDR4",
      storage: "16GB eMMC",
      wifi: "802.11 ac/ax",
    },
    rating: 4.9,
    users: "1.8M+",
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "uclan",
    name: "Uclan",
    model: "Denys H.265",
    image: "/placeholder.svg",
    description: "Reliable and efficient digital receiver",
    price: "Budget Friendly",
    features: [
      "H.265 HEVC Support",
      "Full HD 1080p",
      "Ethernet & WiFi",
      "USB Media Player",
      "DiSEqC 1.2",
    ],
    specs: {
      cpu: "ARM Cortex-A7 Dual Core",
      ram: "512MB DDR3",
      storage: "4GB Flash",
      wifi: "802.11 b/g/n",
    },
    rating: 4.6,
    users: "1.2M+",
    color: "from-green-500 to-green-600",
  },
  {
    id: "hdbox",
    name: "HDBox",
    model: "FS-9200 PVR",
    image: "/placeholder.svg",
    description: "Feature-rich PVR with recording capabilities",
    price: "Best Value",
    features: [
      "Twin Tuner DVB-S2",
      "500GB HDD Included",
      "TimeShift Function",
      "Network Streaming",
      "CI+ Slot",
    ],
    specs: {
      cpu: "MIPS 600MHz",
      ram: "256MB DDR2",
      storage: "500GB HDD",
      wifi: "Optional USB",
    },
    rating: 4.7,
    users: "950K+",
    color: "from-purple-500 to-purple-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function SelectRemotePage() {
  const navigate = useNavigate();

  const handleDeviceSelect = (deviceId: string) => {
    navigate(`/device/${deviceId}/menu`);
  };

  return (
    <Layout showBackButton title="Select Your Device">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow">
            Choose Your <span className="text-blue-400">Device</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Select your digital TV set-top box model to access personalized
            setup guides, 3D models, and interactive support tools.
          </p>
        </motion.div>

        {/* Device Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {devices.map((device, index) => (
            <motion.div
              key={device.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className="device-card h-full overflow-hidden group cursor-pointer"
                onClick={() => handleDeviceSelect(device.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white mb-1">
                        {device.name}
                      </CardTitle>
                      <p className="text-gray-400">{device.model}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`bg-gradient-to-r ${device.color} text-white border-0`}
                    >
                      {device.price}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white ml-1 font-medium">
                        {device.rating}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-400 ml-1">{device.users}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Device Image Placeholder */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center group-hover:from-gray-600 group-hover:to-gray-700 transition-all duration-300">
                    <Tv className="h-16 w-16 text-gray-400" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed">
                    {device.description}
                  </p>

                  {/* Features */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {device.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm text-gray-400"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <Cpu className="h-4 w-4 text-blue-400 mr-2" />
                      Specifications
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CPU:</span>
                        <span className="text-white">{device.specs.cpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">RAM:</span>
                        <span className="text-white">{device.specs.ram}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Storage:</span>
                        <span className="text-white">
                          {device.specs.storage}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">WiFi:</span>
                        <span className="text-white">{device.specs.wifi}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full nav-button group bg-gradient-to-r ${device.color}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeviceSelect(device.id);
                    }}
                  >
                    Select {device.name}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Help Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="glass rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              Can't Find Your Device?
            </h3>
            <p className="text-gray-300 mb-6">
              Don't worry! Our support team can help you identify your device
              and provide the right guidance for your specific model.
            </p>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate("/support")}
            >
              Contact Support
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

import { useRef, useState } from 'react';
import {
  Bell,
  Bold,
  ChevronDown,
  CircleUserRound,
  CloudUpload,
  FileText,
  Italic,
  LayoutDashboard,
  List,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { attributes } from '@/lib/attributes';

const categories = ['Audio', 'Accessories', 'Computers', 'Mobile', 'Wearables'];

const emptyVariant = { selectedAttrs: [], selections: {}, price: '', stock: '', images: [] };

const composeName = (selectedAttrs, selections) => {
  const parts = selectedAttrs
    .map((slug) => {
      const attr = attributes.find((a) => a.slug === slug);
      const optSlug = selections[slug];
      return optSlug ? attr?.options.find((o) => o.slug === optSlug)?.label : null;
    })
    .filter(Boolean);
  return parts.join(' | ');
};

const toSku = (name) => name.trim().toLowerCase().split(/\s*[|/\s]+\s*/).filter(Boolean).join('-');

function AddProduct() {
  const fileInputRefs = useRef({});
  const [form, setForm] = useState({
    name: '', sku: '', category: '', description: '', publish: true,
  });
  const [variants, setVariants] = useState([{ ...emptyVariant }]);
  const [draggingVariant, setDraggingVariant] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const addVariant = () => setVariants((current) => [...current, { ...emptyVariant }]);

  const removeVariant = (index) => {
    setVariants((current) => {
      current[index].images.forEach(({ preview }) => URL.revokeObjectURL(preview));
      return current.filter((_, variantIndex) => variantIndex !== index);
    });
  };

  const addAttributeToVariant = (variantIndex, attrSlug) => {
    setVariants((current) => current.map((variant, vIndex) => {
      if (vIndex !== variantIndex) return variant;
      if (variant.selectedAttrs.includes(attrSlug)) return variant;
      const selectedAttrs = [...variant.selectedAttrs, attrSlug];
      return { ...variant, selectedAttrs };
    }));
  };

  const removeAttributeFromVariant = (variantIndex, attrSlug) => {
    setVariants((current) => current.map((variant, vIndex) => {
      if (vIndex !== variantIndex) return variant;
      const selectedAttrs = variant.selectedAttrs.filter((s) => s !== attrSlug);
      const selections = { ...variant.selections };
      delete selections[attrSlug];
      const name = composeName(selectedAttrs, selections);
      return { ...variant, selectedAttrs, selections, name, sku: toSku(name) };
    }));
  };

  const selectAttributeOption = (variantIndex, attrSlug, optionSlug) => {
    setVariants((current) => current.map((variant, vIndex) => {
      if (vIndex !== variantIndex) return variant;
      const selections = { ...variant.selections };
      if (selections[attrSlug] === optionSlug) {
        delete selections[attrSlug];
      } else {
        selections[attrSlug] = optionSlug;
      }
      const name = composeName(variant.selectedAttrs, selections);
      return { ...variant, selections, name, sku: toSku(name) };
    }));
  };

  const updateVariant = (index, field, value) => {
    setVariants((current) => current.map((variant, variantIndex) => (
      variantIndex === index ? { ...variant, [field]: value } : variant
    )));
  };

  const addImagesToVariant = (index, files) => {
    const nextImages = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setVariants((current) => current.map((variant, variantIndex) => (
      variantIndex === index ? { ...variant, images: [...variant.images, ...nextImages] } : variant
    )));
  };

  const removeImageFromVariant = (variantIndex, imageIndex) => {
    setVariants((current) => current.map((variant, vIndex) => {
      if (vIndex !== variantIndex) return variant;
      URL.revokeObjectURL(variant.images[imageIndex].preview);
      return { ...variant, images: variant.images.filter((_, iIndex) => iIndex !== imageIndex) };
    }));
  };

  const uploadImages = async (images, uploadedPaths) => {
    return Promise.all(images.map(async ({ file }) => {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (uploadError) throw uploadError;
      uploadedPaths.push(path);
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      return data.publicUrl;
    }));
  };

  const saveProduct = async () => {
    setNotice(null);
    if (!form.name.trim() || !form.sku.trim() || !form.category) {
      setNotice({ type: 'error', text: 'Please complete the required product fields before saving.' });
      return;
    }

    setIsSaving(true);
    let uploadedPaths = [];
    try {
      const { data: productData, error: productError } = await supabase.from('products').insert({
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        description: form.description.trim(),
        publish_product: form.publish,
        image_urls: [],
      }).select('id').single();
      if (productError) throw productError;

      const variantRows = await Promise.all(variants.map(async (variant) => {
        const imageUrls = variant.images.length
          ? await uploadImages(variant.images, uploadedPaths)
          : [];
        return {
          product_id: productData.id,
          name: variant.name || '',
          sku: variant.sku || '',
          price: Number(variant.price || 0),
          stock_quantity: Number(variant.stock || 0),
          image_urls: imageUrls,
        };
      }));

      const { error: variantsError } = await supabase.from('product_variants').insert(variantRows);
      if (variantsError) throw variantsError;

      setNotice({ type: 'success', text: 'Product saved successfully.' });
      setForm({ name: '', sku: '', category: '', description: '', publish: true });
      variants.forEach((variant) => variant.images.forEach(({ preview }) => URL.revokeObjectURL(preview)));
      setVariants([{ ...emptyVariant }]);
    } catch (error) {
      if (uploadedPaths.length) {
        await supabase.storage.from('product-images').remove(uploadedPaths);
      }
      setNotice({ type: 'error', text: error.message || 'Something went wrong while saving the product.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Package size={19} /></span><span>Product<span className="brand-light">Manager</span></span></div>
        <nav className="sidebar-nav">
          <p className="nav-label">Workspace</p>
          <button className="nav-item"><LayoutDashboard size={17} /> Dashboard</button>
          <button className="nav-item active"><ShoppingBag size={17} /> Products</button>
          <button className="nav-item"><FileText size={17} /> Orders</button>
          <button className="nav-item"><Settings size={17} /> Settings</button>
        </nav>
        <div className="storage-card">
          <div className="storage-title">Storage used</div>
          <div className="storage-bar"><span /></div>
          <div className="storage-copy"><strong>75%</strong> of 10GB</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="search-box"><span>⌕</span><input placeholder="Search anything..." aria-label="Search" /></div>
          <div className="topbar-right"><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="profile"><div><strong>Alex Rivera</strong><small>ADMIN</small></div><span><CircleUserRound size={19} /></span></div></div>
        </header>

        <div className="content">
          <div className="page-heading"><div><h1>Add New Product</h1><p>Create a new product listing in your catalog.</p></div><div className="heading-actions"><button className="cancel-button" onClick={() => window.location.reload()}>Cancel</button><button className="save-button" onClick={saveProduct} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Product'}</button></div></div>
          {notice && <div className={`notice ${notice.type}`} role="status">{notice.text}<button onClick={() => setNotice(null)} aria-label="Dismiss"><X size={16} /></button></div>}

          <div className="editor-grid">
            <div className="left-column">
              <section className="panel basic-panel"><h2>Basic Information</h2>
                <label>Product Name <input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="e.g. Wireless Noise-Cancelling Headphones" /></label>
                <div className="two-fields"><label>SKU <input value={form.sku} onChange={(event) => updateField('sku', event.target.value)} placeholder="e.g. WNH-001" /></label><label>Category <div className="select-wrap"><select value={form.category} onChange={(event) => updateField('category', event.target.value)}><option value="">Select category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown size={16} /></div></label></div>
                <label>Description <div className="editor"><div className="editor-toolbar"><button aria-label="Bold"><Bold size={14} /></button><button aria-label="Italic"><Italic size={14} /></button><button aria-label="List"><List size={15} /></button></div><textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Enter product description..." /></div></label>
              </section>

              <section className="panel variants-panel">
                <div className="section-heading"><div><h2>Product Variants</h2><p>Select attributes for each variant. Name and SKU generate automatically.</p></div><button className="green-button" onClick={addVariant}><Plus size={16} /> Add Variant</button></div>
                <div className="variant-list">
                  {variants.map((variant, index) => (
                    <div className="variant-card" key={index}>
                      <div className="variant-card-header">
                        <span className="variant-number">Variant {index + 1}</span>
                        {variants.length > 1 && <button className="delete-button" onClick={() => removeVariant(index)} aria-label="Remove variant"><Trash2 size={15} /> Remove</button>}
                      </div>

                      <div className="variant-attributes">
                        <div className="attribute-picker">
                          <div className="select-wrap">
                            <select
                              value=""
                              onChange={(event) => {
                                if (event.target.value) addAttributeToVariant(index, event.target.value);
                                event.target.value = '';
                              }}
                            >
                              <option value="">Add attribute...</option>
                              {attributes
                                .filter((attr) => !variant.selectedAttrs.includes(attr.slug))
                                .map((attr) => (
                                  <option key={attr.slug} value={attr.slug}>{attr.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} />
                          </div>
                        </div>

                        {variant.selectedAttrs.map((attrSlug) => {
                          const attr = attributes.find((a) => a.slug === attrSlug);
                          if (!attr) return null;
                          return (
                            <div className="attribute-group" key={attrSlug}>
                              <div className="attribute-header">
                                <p className="attribute-label">{attr.name}</p>
                                <button
                                  type="button"
                                  className="attribute-remove"
                                  onClick={() => removeAttributeFromVariant(index, attrSlug)}
                                  aria-label={`Remove ${attr.name}`}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                              <div className="attribute-options">
                                {attr.options.map((opt) => {
                                  const selected = variant.selections[attrSlug] === opt.slug;
                                  if (attrSlug === 'color') {
                                    return (
                                      <button
                                        key={opt._id}
                                        type="button"
                                        className={`color-swatch ${selected ? 'selected' : ''}`}
                                        style={{ background: opt.hex, color: opt.textColor }}
                                        title={opt.label}
                                        onClick={() => selectAttributeOption(index, attrSlug, opt.slug)}
                                        aria-label={opt.label}
                                      >
                                        {selected && <span className="swatch-check" />}
                                      </button>
                                    );
                                  }
                                  return (
                                    <button
                                      key={opt._id}
                                      type="button"
                                      className={`size-pill ${selected ? 'selected' : ''}`}
                                      onClick={() => selectAttributeOption(index, attrSlug, opt.slug)}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="variant-summary">
                        <label>Variant Name <input value={variant.name || ''} readOnly placeholder="auto-generated from selections" /></label>
                        <label>SKU <input value={variant.sku || ''} readOnly placeholder="auto-generated from name" /></label>
                        <label>Price <div className="money-input"><span>$</span><input type="number" min="0" step="0.01" value={variant.price} onChange={(event) => updateVariant(index, 'price', event.target.value)} placeholder="0.00" /></div></label>
                        <label>Stock <input type="number" min="0" value={variant.stock} onChange={(event) => updateVariant(index, 'stock', event.target.value)} placeholder="0" /></label>
                      </div>

                      <div className="variant-media">
                        <p className="variant-media-label">Images</p>
                        <div className={`drop-zone small ${draggingVariant === index ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDraggingVariant(index); }} onDragLeave={() => setDraggingVariant(null)} onDrop={(event) => { event.preventDefault(); setDraggingVariant(null); addImagesToVariant(index, event.dataTransfer.files); }} onClick={() => fileInputRefs.current[index]?.click()}>
                          <input ref={(el) => { fileInputRefs.current[index] = el; }} type="file" accept="image/*" multiple hidden onChange={(event) => { addImagesToVariant(index, event.target.files); event.target.value = ''; }} />
                          {variant.images.length ? (
                            <div className="image-grid">
                              {variant.images.map((image, imageIndex) => (
                                <div className="image-preview" key={image.preview}>
                                  <img src={image.preview} alt="Variant preview" />
                                  <button onClick={(event) => { event.stopPropagation(); removeImageFromVariant(index, imageIndex); }} aria-label="Remove image"><X size={13} /></button>
                                </div>
                              ))}
                              <div className="add-more"><Plus size={18} /><span>Add more</span></div>
                            </div>
                          ) : (
                            <><div className="upload-icon"><CloudUpload size={22} /></div><strong>Drag and drop images here</strong><span>or click to browse files</span></>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="right-column"><section className="panel status-panel"><h2>Status</h2><div className="status-toggle"><div><strong>Publish Product</strong><p>Make product visible to customers.</p></div><button className={`toggle ${form.publish ? 'on' : ''}`} onClick={() => updateField('publish', !form.publish)} aria-label="Toggle publish status"><span /></button></div></section></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddProduct;
